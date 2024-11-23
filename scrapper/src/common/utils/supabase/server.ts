import { createClient } from "@supabase/supabase-js"
import { env } from "@/common/utils/envConfig"

export function createAdminClient() {
  return createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!)
}
