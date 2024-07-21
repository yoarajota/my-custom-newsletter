import { create } from "zustand"
import { supabase } from "@lib/supabase/client"
import type { UseAuth } from "types/stores"

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
}))

export default useAuth
