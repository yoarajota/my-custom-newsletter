import { drizzle } from "drizzle-orm/postgres-js"
import Postgres from "postgres"
import { env } from "@/common/utils/envConfig"
import * as schema from "@/db/schema" // Importe o esquema

const { DATABASE_URL } = env
const getDrizzleDb = () => {
  const pool = Postgres(DATABASE_URL, {
    max: 1,
  })

  const db = drizzle(pool, { schema })

  return db
}

export default getDrizzleDb
