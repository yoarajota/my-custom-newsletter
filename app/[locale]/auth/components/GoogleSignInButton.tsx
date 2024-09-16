"use client"

import { MouseEvent } from "react"
import { Button } from "@components/ui/button"

import { supabase } from "@lib/supabase/client"
import { getApiURL } from "helpers/server"

async function googleSignIn(e: MouseEvent<HTMLElement>) {
  e.preventDefault()

  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: await getApiURL("auth/callback"),
    },
  })
}

const GoogleSignInButton = () => {
  return (
    <Button className="w-full" onClick={googleSignIn}>
      Login with Google
    </Button>
  )
}

export default GoogleSignInButton
