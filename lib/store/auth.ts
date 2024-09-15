import { redirect } from "next/navigation"
import { create } from "zustand"
import { supabase } from "@lib/supabase/client"
import type { UseAuth } from "types/stores"

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/"
  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`
  return url
}

async function googleSignIn() {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getURL(),
    },
  })
}

const useAuth = create<UseAuth>((set, get) => ({
  user: null,
  session: null,
  fetching: false,
  fetched: false,
  init: async () => {
    const currentState = get()

    if (currentState.fetching || currentState.fetched) {
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session })
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session })
    })
  },

  signIn: async (type = "google") => {
    if (type === "google") {
      await googleSignIn()
    }
  },
}))

export default useAuth
