"use server"

import { createClient } from "@lib/supabase/server"
import { NewslettersTopics } from "types/common/newsletter"

export const handleTopicToAccount = async (topic: string, lang: string) => {
  const supabase = createClient()

  const { data, error: err } = await supabase.functions.invoke("handle-topic", {
    body: {
      topic,
      lang,
    },
  })

  let error = null
  if (err) {
    error = err.message
  }

  return { data, error }
}

export const queryAssignedUserTopic = async (account_id?: string) => {
  if (!account_id) {
    return null
  }

  const supabase = createClient()

  const { data } = await supabase
    .from("newsletters_accounts_topic_subscription")
    .select("newsletter_topic_id(name, summary, id)")
    .eq("account_id", account_id)
    .single()

  return (data?.newsletter_topic_id ?? null) as NewslettersTopics | null
}
