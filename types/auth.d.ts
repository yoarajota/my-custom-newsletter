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
