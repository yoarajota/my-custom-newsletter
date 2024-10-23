"use server"

import { User } from "@supabase/supabase-js"
import { createClient } from "@lib/supabase/server"
import env from "env.mjs"
import { Account, Auth, BillingStatus, Plan } from "types/auth"

// START AUTH
// START AUTH
// START AUTH

const state: {
  user: User | null
  userPromise: Promise<User | null> | null
  accounts: Array<Account> | null
  accountsPromise: Promise<Array<Account> | null> | null
  auth: Auth
  authPromise: Promise<Auth> | null
} = {
  user: null,
  userPromise: null,
  accounts: null,
  accountsPromise: null,
  auth: {
    user: null,
    account: null,
  },
  authPromise: null,
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

export async function getAuth() {
  if (state.auth && state.auth.user && state.auth.account) {
    return state.auth
  }

  if (state.authPromise) {
    return state.authPromise
  }

  state.authPromise = new Promise(async (resolve, reject) => {
    try {
      const [user, accounts] = await Promise.all([getUser(), getAccounts()])

      state.auth = { user, account: accounts?.[0] ?? null }

      resolve(state.auth)
    } catch (error) {
      console.log(error)

      reject(error)
    } finally {
      state.authPromise = null
    }
  })

  return state.authPromise
}

// END AUTH
// END AUTH
// END AUTH

// START BILLING
// START BILLING
// START BILLING

const billingState: {
  plans: Plan[] | null
  plansPromise: Promise<Plan[] | null> | null
  billingStatus: BillingStatus | null
  billingStatusPromise: Promise<BillingStatus | null> | null
} = {
  plans: null,
  plansPromise: null,
  billingStatus: null,
  billingStatusPromise: null,
}

export async function getPlans() {
  if (billingState.plans) {
    return billingState.plans
  }

  if (billingState.plansPromise) {
    return billingState.plansPromise
  }

  billingState.plansPromise = new Promise(async (resolve, reject) => {
    try {
      const supabase = createClient()

      const { data, error } = await supabase.functions.invoke("billing-functions", {
        body: {
          action: "get_plans",
        },
      })

      if (error) {
        console.log(error)
        console.log(await error.response.text())

        throw error
      }

      billingState.plans = data

      resolve(billingState.plans)
    } catch (error) {
      console.log(error)
      reject(error)
    } finally {
      billingState.plansPromise = null
    }
  })

  return billingState.plansPromise
}

export async function getBillingStatus() {
  if (billingState.billingStatus) {
    return billingState.billingStatus
  }

  if (billingState.billingStatusPromise) {
    return billingState.billingStatusPromise
  }

  billingState.billingStatusPromise = new Promise(async (resolve, reject) => {
    try {
      await getAuth()

      const supabase = createClient()

      const { data, error } = await supabase.functions.invoke("billing-functions", {
        body: {
          action: "get_billing_status",
          args: {
            account_id: state.auth.account?.account_id,
          },
        },
      })

      if (error) {
        console.log(error)
        console.log(await error.response.text())

        throw error
      }

      billingState.billingStatus = data

      resolve(billingState.billingStatus)
    } catch (error) {
      console.log(error)
      reject(error)
    } finally {
      billingState.billingStatusPromise = null
    }
  })

  return billingState.billingStatusPromise
}

export async function subscribeToDefaultPlan(account_id: string | undefined) {
  if (!account_id) {
    return
  }

  const supabase = createClient()

  const url = env.NEXT_PUBLIC_APP_URL + "/dashboard"

  const { data, error } = await supabase.functions.invoke("billing-functions", {
    body: {
      action: "get_new_subscription_url",
      args: {
        account_id,
        success_url: url,
        cancel_url: url,
      },
    },
  })

  return data.url
}

// END BILLING
// END BILLING
// END BILLING
