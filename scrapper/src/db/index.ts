import { drizzle } from "drizzle-orm/node-postgres"
import { env } from "@/common/utils/envConfig"

const { DATABASE_URL } = env

export const db = drizzle(DATABASE_URL)
