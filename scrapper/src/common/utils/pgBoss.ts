import PgBoss, { WorkHandler } from "pg-boss"
import { env } from "@/common/utils/envConfig"

const { DATABASE_URL } = env

interface PgBossConfig {
  queue: string
  jobData: Record<string, any>
  callback: WorkHandler<any>
}

export async function handlePgBoss({ queue, jobData, callback }: PgBossConfig) {
  const boss = new PgBoss(DATABASE_URL)

  boss.on("error", console.error)

  await boss.start()

  await boss.createQueue(queue)

  const id = await boss.send(queue, jobData)

  console.log(`created job ${id} in queue ${queue}`)

  await boss.work(queue, callback)

  return boss
}
