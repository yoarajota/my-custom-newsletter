import { sql } from "drizzle-orm"
import { pgTable, text, timestamp, uuid, vector } from "drizzle-orm/pg-core"

export const newslettersTopics = pgTable("newsletters_topics", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  created_at: timestamp("created_at", { withTimezone: true })
    .default(sql`timezone('utc'::text, now())`)
    .notNull(),
  name: text("name").notNull(),
  summary: text("summary").notNull(),
  se_description: text("se_description").notNull(),
  embedding: vector("embedding", { dimensions: 384 }).notNull(),
})

export const newslettersTopicFilesContents = pgTable("newsletters_topic_files_contents", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  created_at: timestamp("created_at", { withTimezone: true })
    .default(sql`timezone('utc'::text, now())`)
    .notNull(),
  newsletter_topic_id: uuid("newsletter_topic_id").notNull(),
  url: text("url").notNull(),
  content: text("content").notNull(),
})
