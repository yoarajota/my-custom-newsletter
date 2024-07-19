import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    ANALYZE: z.string().toLowerCase().transform((x) => x === 'true').pipe(z.boolean()),
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string(),
  },
  client: {
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string(),
  },
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE ?? "false",
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_CLIENT_ROLE_KEY: process.env.SUPABASE_CLIENT_ROLE_KEY,
  },
})
