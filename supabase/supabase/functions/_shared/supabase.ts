import { createClient } from "jsr:@supabase/supabase-js@2"

export function createSupabaseClient(request) {
  const authHeader = request.headers.get("Authorization")!

  if (!authHeader) {
    throw new Error("Authorization header is missing")
  }

  console.log(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "")

  return createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
    global: { headers: { Authorization: authHeader } },
  })
}
