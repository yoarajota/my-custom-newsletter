import { defineConfig } from "drizzle-kit"
import { env } from "@/common/utils/envConfig"

const { DATABASE_URL } = env

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
})
