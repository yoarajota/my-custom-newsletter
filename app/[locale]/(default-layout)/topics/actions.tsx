"use server"

import { createClient } from "@lib/supabase/server"
import { NewslettersTopics } from "types/common/newsletter"

export const getUserTopics = async (account_id?: string) => {
  if (!account_id) {
    return null
  }

  const supabase = createClient()

  const { data } = await supabase
    .from("newsletters_accounts_topic_subscription")
    .select("newsletters_topics(id, name, summary)")
    .eq("account_id", account_id)

  return data?.map((item) => item.newsletters_topics) as unknown as NewslettersTopics[]
}

export const getAllEmailsFromTopic = async (topic_id: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("newsletters_topics_emails")
    .select()
    .eq("newsletter_topic_id", topic_id)
    .order("created_at", { ascending: false })

  return data
}
