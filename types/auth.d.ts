import { User } from "@supabase/supabase-js"

export type Account = {
  account_id: string
  account_role: "owner" | "member"
  is_primary_owner: boolean
  name: string
  slug: string
  personal_account: boolean
  billing_enabled: boolean
  billing_status: "active" | "inactive"
  created_at: string
  updated_at: string
  metadata: Record<string, string>
  current_active_account?: boolean
}

export type Auth = {
  user: User | null
  account: Account | null
}

export type Plan = {
  id: string
  name: string
  description: string
  amount: number
  currency: string
  interval: string
  interval_count: number
  trial_period_days: number
  active: boolean
}

export type BillingStatus = {
  subscription_id: string
  subscription_active: boolean
  status: "active" | "trialing" | "past_due" | "canceled" | "unpaid" | "incomplete" | "incomplete_expired"
  billing_email: string
  account_role: string
  is_primary_owner: boolean
  billing_enabled: boolean
}
