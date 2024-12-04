import { createClient } from "jsr:@supabase/supabase-js@2"

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

export async function getUserAccount(client: ReturnType<createClient>) {
  const { data } = await client.rpc("get_accounts")

  return data?.[0]
}

export function success(obj: { [key: string]: any }) {
  return new Response(JSON.stringify({ status: "success", ...obj }), {
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  })
}

export function error(obj: { [key: string]: any }) {
  return new Response(JSON.stringify({ status: "error", ...obj }), {
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  })
}
