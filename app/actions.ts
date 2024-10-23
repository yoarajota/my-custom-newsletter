"use server"

import { redirect } from "next/navigation"
import { createClient } from "@lib/supabase/server"
import { getApiURL } from "helpers/server"

export async function googleSignIn() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: await getApiURL("auth/callback"),
    },
  })

  console.log("data.url", data.url)

  if (data.url) {
    redirect(data.url)
  }
}
