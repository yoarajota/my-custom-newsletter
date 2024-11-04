import { env, pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0"
import Groq from "https://cdn.jsdelivr.net/npm/groq-sdk@0.7.0/+esm"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Tables } from "../../db_types.ts"
import { getUserAccount, success } from "../_shared/index.ts"
import { createSupabaseAdminClient, createSupabaseClient } from "../_shared/supabase.ts"

const groq = new Groq({ apiKey: Deno.env.get("GROQ_API_KEY") })

// Preparation for Deno runtime
env.useBrowserCache = false
env.allowLocalModels = false

const generator = async (content: string, lang: string) => {
  const example = `{ "msg": "str"}`

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a google search engine master. You only returns in JSON with this format ${example}. You write in ${lang}.`,
      },
      {
        role: "user",
        content,
      },
    ],
    model: "llama3-8b-8192",
    temperature: 0.2,
    max_tokens: 1024,
    top_p: 1,
  })

  return JSON.parse(chatCompletion.choices[0].message.content).msg
}

// Deno Handler
serve(async (req) => {
  try {
    // Construct pipeline outside of serve for faster warm starts
    const pipe = await pipeline("feature-extraction", "Supabase/gte-small")

    const { topic, lang } = await req.json()

    // Generate the embedding from the user topic
    const output = await pipe(topic, {
      pooling: "mean",
      normalize: true,
    })

    // Get the embedding output
    const embedding = Array.from(output.data)

    const supabase = createSupabaseClient(req)

    const admin = createSupabaseAdminClient()

    const { data: similarContent, error } = await supabase.rpc("check_topic_similarity", {
      new_embedding: embedding,
      threshold: 0.8,
    })

    if (error) throw error

    let newsletterTopic: Tables<"newsletters_topics"> | undefined

    for (const simmilar of similarContent) {
      if (simmilar.similarity > 0.95) {
        newsletterTopic = simmilar

        break
      }
    }

    if (!newsletterTopic) {
      const [summary, se_description] = await Promise.all([
        generator(`Create a realy small summary about '${topic}'`, lang),
        generator(`Create a query to search about '${topic}' in google search engine.`, lang),
      ])

      const { data, error: newslettersTopicError } = await admin
        .from("newsletters_topics")
        .insert({
          name: topic,
          summary,
          se_description,
          embedding,
        })
        .select("id, name, sumarry")
        .single()

      if (newslettersTopicError) throw newslettersTopicError

      newsletterTopic = data
    }

    const account = await getUserAccount(supabase)

    await admin.from("newsletters_accounts_topic_subscription").insert({
      newsletter_topic_id: newsletterTopic?.id,
      account_id: account.account_id,
    })

    return success({
      message: "Assigned",
      topic: newsletterTopic,
    })
  } catch (error) {
    console.log("-_-_-_-_-_-_-_-_-_-_-_- ERROR -_-_-_-_-_-_-_-_-_-_-_-")
    console.log(error)

    return error({
      message: "Error",
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:64321/functions/v1/handle_topic' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
