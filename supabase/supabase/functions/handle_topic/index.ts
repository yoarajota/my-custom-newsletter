import { env, pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { CORS_HEADERS } from "../_shared/index.ts"
import { createSupabaseClient } from "../_shared/supabase.ts"

// Preparation for Deno runtime
env.useBrowserCache = false
env.allowLocalModels = false

// Deno Handler
serve(async (req) => {
  try {
    // Construct pipeline outside of serve for faster warm starts
    const pipe = await pipeline("feature-extraction", "Supabase/gte-small")

    console.log("a")

    // Configurar pipeline de geração
    const generator = await pipeline("text-generation", "meta-llama/Meta-Llama-3-8B", {
      headers: { Authorization: `Bearer ${Deno.env.get("HUGGING_FACE_ACCESS_TOKEN")}` },
    })

    console.log("b")

    const { topic } = await req.json()

    console.log(topic)

    // Generate the embedding from the user topic
    const output = await pipe(topic, {
      pooling: "mean",
      normalize: true,
    })

    // Get the embedding output
    const embedding = Array.from(output.data)

    const supabase = createSupabaseClient(req)

    console.log("asdasdasd")

    const { data: similarContent, error } = await supabase.rpc("check_topic_similarity", {
      new_embedding: embedding,
      threshold: 0.8,
    })

    console.log(similarContent)

    if (error) throw error

    if (!similarContent.length) {
      console.log("similarContent.length")

      // Gerar nome do conteúdo
      const name = await generator(`Crie um título interessante para um artigo sobre '${topic}'`)[0]["generated_text"]

      // Gerar resumo
      const summary = await generator(`Resuma brevemente o conteúdo de um artigo sobre '${topic}'`)[0]["generated_text"]

      // Gerar descrição SEO
      const se_description = await generator(
        `Liste palavras-chave para SEO sobre '${topic}' separadas por vírgulas`
      )[0]["generated_text"]

      const { data, error } = await supabase.from("newsletters_topics").insert({
        name,
        summary,
        se_description,
        embedding,
      })
    }

    // Return the embedding
    return new Response({ hi: "hi" }, { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } })
  } catch (error) {
    console.log("-_-_-_-_-_-_-_-_-_-_-_- ERROR -_-_-_-_-_-_-_-_-_-_-_-")
    console.log(error)

    return new Response({ error: "Error" }, { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } })
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
