import { NextResponse } from "next/server"

import { createClient } from "@lib/supabase/server"
import env from "env.mjs"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host")

      if (env.ENV === "development") {
        console.log(`${origin}${next}`)
        return NextResponse.redirect(`${origin}${next}/dashboard`)
      } else if (forwardedHost) {
        console.log(`https://${forwardedHost}${next}/dashboard`)
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
