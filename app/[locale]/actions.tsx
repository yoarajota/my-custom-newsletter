"use server"

import { User } from "@supabase/supabase-js"
import { createClient } from "@lib/supabase/server"
import { Account } from "types/auth"

const state: {
  user: User | null
  userPromise: Promise<User | null> | null
  accounts: Account | null
  accountsPromise: Promise<Array<Account> | null> | null
} = {
  user: null,
  userPromise: null,
  accounts: null,
  accountsPromise: null,
}

export async function getUser() {
  if (state.user) {
    return state.user
  }

  if (state.userPromise) {
    return state.userPromise
  }

  state.userPromise = new Promise(async (resolve, reject) => {
    try {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      state.user = user
      resolve(user)
    } catch (error) {
      reject(error)
    } finally {
      state.userPromise = null
    }
  })

  return state.userPromise
}

export async function getAccounts() {
  if (state.accounts) {
    return state.accounts
  }

  if (state.accountsPromise) {
    return state.accountsPromise
  }

  state.accountsPromise = new Promise(async (resolve, reject) => {
    try {
      const supabase = createClient()

      const { data } = await supabase.rpc("get_accounts")

      state.accounts = data

      resolve(data)
    } catch (error) {
      reject(error)
    } finally {
      state.accountsPromise = null
    }
  })

  return state.accountsPromise
}
