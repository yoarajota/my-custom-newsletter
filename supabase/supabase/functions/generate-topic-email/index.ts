import Groq from "https://cdn.jsdelivr.net/npm/groq-sdk@0.7.0/+esm"
import { marked } from "https://cdn.jsdelivr.net/npm/marked@15.0.2/+esm"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { error, success } from "../_shared/index.ts"
import { createSupabaseAdminClient } from "../_shared/supabase.ts"

const BASE = `
<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent;">
  <tbody>
    <tr>
      <td>
        {CONTENT}
      </td>
    </tr>
  </tbody>
</table>
`

// const HEADER = `
// <table class="heading_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
//   <tbody>
//     <tr>
//       <td class="pad">
//         <h1 style="margin: 0; color: #1e0e4b; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 38px; font-weight: 700; line-height: 120%; text-align: left;">
//           {TITLE}
//         </h1>
//       </td>
//     </tr>
//   </tbody>
// </table>
// `

// const PARAGRAPH = `
// <table class="paragraph_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
//   <tbody>
//     <tr>
//       <td class="pad">
//         <div style="color: #444a5b; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 16px; line-height: 120%; text-align: left;">
//           <p style="margin: 0;">{PARAGRAPH}</p>
//         </div>
//       </td>
//     </tr>
//   </tbody>
// </table>
// `

const groq = new Groq({ apiKey: Deno.env.get("GROQ_API_KEY") })

// const template = `[{
//   text: constr(str),
//   type: constr(paragraph|header),
// }]`

const generator = async (content: string) => {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a newsletter writer. You create rich content for newsletters. You receive a lot of information from web pages and you need to summarize them in a email. You write in Portuguese. You only returns markdown text.`,
      },
      {
        role: "user",
        content,
      },
    ],
    model: "llama3-8b-8192",
    temperature: 0.5,
    max_tokens: 1024,
    top_p: 1,
  })

  return chatCompletion.choices[0].message.content
}

// Deno Handler
serve(async (req) => {
  try {
    const { newsletter_topic_id, date } = await req.json()

    // if (!newsletter_topic_id || !date) {
    //   throw new Error("Invalid request")
    // }

    const admin = createSupabaseAdminClient()

    const { data: contents, error } = await admin
      .from("newsletters_topic_files_contents")
      .select("content, url")
      .eq("newsletter_topic_id", newsletter_topic_id)
      .eq("created_at", date)

    if (contents.length) {
      // const a = await generator(JSON.stringify(contents.map(({ content }) => content)))

      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("SENDGRID_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [
                {
                  email: "joaovbscontato@gmail.com",
                  name: "João",
                },
              ],
              subject: "Hello, World!",
            },
          ],
          content: [
            {
              type: "text/html",
              value: BASE.replace("{CONTENT}", marked.parse(a.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ""))),
            },
          ],
          from: {
            email: "joaovbscontato@gmail.com",
            name: "João",
          },
        }),
      })

      console.log(response)

      if (response.ok) {
        console.log("Email enviado com sucesso!")
      } else {
        const error = await response.text()
        console.error("Erro ao enviar email:", response.status, error)
      }
    }

    return success({
      message: "Email generated",
    })
  } catch (err) {
    return error({
      message: "Error",
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:64321/functions/v1/generate-topic-email' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
