import Groq from "https://cdn.jsdelivr.net/npm/groq-sdk@0.7.0/+esm"
import { marked } from "https://cdn.jsdelivr.net/npm/marked@15.0.2/+esm"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { error, success } from "../_shared/index.ts"
import { createSupabaseAdminClient } from "../_shared/supabase.ts"

const BASE = `
<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
  <tbody>
    <tr>
      <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 31.25rem; margin: 0 auto;" width="500">
          <tbody>
            <tr>
              <td width="100%" style="padding: .625rem; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: .3125rem; padding-top: .3125rem; vertical-align: top; border-top: 0rem; border-right: 0rem; border-bottom: 0rem; border-left: 0rem;">
                {CONTENT}
              </td>
            </tr>
            <tr>
              <td width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: .3125rem; padding-top: .3125rem; vertical-align: top; border-top: 0rem; border-right: 0rem; border-bottom: 0rem; border-left: 0rem; margin: .625rem; font-size: .0625rem; line-height: .0625rem; border-bottom: .0625rem solid #dddddd;">
                <span style="word-break: break-word;"></span>
              </td>
            </tr>
            <tr>
              <td width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: .3125rem; padding-top: .3125rem; vertical-align: top; border-top: 0rem; border-right: 0rem; border-bottom: 0rem; border-left: 0rem;">
                <div style="padding: .625rem; color:#444a5b;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:1rem;font-weight:400;letter-spacing:0rem;line-height:120%;text-align:left;mso-line-height-alt:1.2rem;">
                  <p style="margin: 0;">As informações desta newsletter foram retiradas de;</p>
                </div>
                <br>
                <div style="padding: .625rem; margin-left:-1.25rem">
                  {CREDITS}
                </div>
                <br>
                <div style="padding: .625rem; color:#444a5b;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:1rem;font-weight:400;letter-spacing:0rem;line-height:120%;text-align:left;mso-line-height-alt:1.2rem;">
                  <p style="margin: 0;">Considere ler o conteúdo original para mais informações. <strong>Créditos totais aos autores originais.</strong></p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
`

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
        content: `You are a newsletter writer specializing in creating rich content in Portuguese. Summarize information from web pages into a single email, structuring text into paragraphs, adding relevant headings, avoiding repetitions and maintaining correct context. Respond exclusively in Markdown format using: Headings ('#', '##', '###'), Bold ('**bold text**'), Italic ('*italicized text*'), Blockquote ('> blockquote'), Ordered Lists ('1. First item 2. Second item'), Unordered Lists ('- First item - Second item'), and Horizontal Rules ('---').`,
      },
      {
        role: "user",
        content,
      },
    ],
    model: "llama3-8b-8192",
    temperature: 0.5,
    max_tokens: 4024,
  })

  return chatCompletion.choices[0].message.content
}

function HEADER(tag = "h1") {
  return `
<${tag} style="padding: .625rem; margin: 0; color: #1e0e4b; direction: ltr; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 2.375rem; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 2.85rem;">
  <span style="word-break: break-word;">{TITLE}</span>
</${tag}>
`
}

const PARAGRAPH = `
<div style="padding: .625rem; color:#444a5b;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:1rem;font-weight:400;letter-spacing:0rem;line-height:120%;text-align:left;mso-line-height-alt:1.2rem;">
  <p style="margin: 0;">{PARAGRAPH}</p>
</div>
`

function replaceTags(content: string): string {
  content = content.replace(/<h1>(.*?)<\/h1>/g, (_, title) => HEADER("h1").replace("{TITLE}", title))

  content = content.replace(/<h2>(.*?)<\/h2>/g, (_, title) => HEADER("h2").replace("{TITLE}", title))

  content = content.replace(/<h3>(.*?)<\/h3>/g, (_, title) => HEADER("h3").replace("{TITLE}", title))

  content = content.replace(/<p>(.*?)<\/p>/g, (_, paragraph) => PARAGRAPH.replace("{PARAGRAPH}", paragraph))

  return content
}

function mountCredits(urls: string[]) {
  return urls
    .map(
      (url) => `<ul style="margin-top: 0; margin-bottom: 0; list-style-type: revert;"><a href="${url}">${url}</a></ul>`
    )
    .join("<br>")
}

function mountMail(content: string, urls: string[]) {
  const parsedContent = marked.parse(content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ""))
  const replacedContent = replaceTags(parsedContent)
  return BASE.replace("{CONTENT}", replacedContent).replace("{CREDITS}", mountCredits(urls))
}

async function sendEmails(
  emailsSubscribed: { email: string; name: string }[],
  emailSubject: string,
  emailHtml: string
) {
  console.log(emailsSubscribed)

  const personalizations = emailsSubscribed.map(({ email, name }) => ({
    to: [
      {
        email,
        name,
      },
    ],
    subject: emailSubject,
  }))

  return await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("SENDGRID_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations,
      content: [
        {
          type: "text/html",
          value: emailHtml,
        },
      ],
      from: {
        email: "joaovbscontato@gmail.com",
        name: "João from My Custom Newsletter",
      },
    }),
  })
}

serve(async (req) => {
  try {
    const { newsletter_topic_id, date } = await req.json()

    if (!newsletter_topic_id || !date) {
      throw new Error("Invalid request")
    }

    const admin = createSupabaseAdminClient()

    const [topicResult, contentsResult] = await Promise.all([
      admin.from("newsletters_topics").select("name").eq("id", newsletter_topic_id),
      admin
        .from("newsletters_topic_files_contents")
        .select("content, url")
        .eq("newsletter_topic_id", newsletter_topic_id)
        .eq("created_at", date),
    ])

    const {
      data: [{ name }],
    } = topicResult

    const { data: contents, error } = contentsResult

    if (error) {
      throw new Error(`Error fetching contents: ${error.message}`)
    }

    if (contents.length) {
      const mdEmailText = await generator(JSON.stringify(contents.map(({ content }) => content)))

      const emailHtml = mountMail(
        mdEmailText,
        contents.map(({ url }) => url)
      )

      const emailSubject = `Novidades de ${name}! 🚀 - Dia ${new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`

      const { data: emailsSubscribed } = await admin.rpc("get_emails_subscribed", {
        newsletter_topic_id,
      })

      let response = { ok: true, text: () => "" as any, status: 200 }
      if (emailsSubscribed?.length) {
        response = await sendEmails(emailsSubscribed, emailSubject, emailHtml)
      }

      if (response.ok) {
        await admin.from("newsletters_topics_emails").insert({
          html: emailHtml,
          newsletter_topic_id,
        })
      } else {
        const error = await response.text()
        console.error("Erro ao enviar email:", response.status, error)
      }
    }

    return success({
      message: "Email generated",
    })
  } catch (err) {
    console.log(err)

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
