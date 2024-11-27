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
