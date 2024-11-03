"use server"

import { createClient } from "@lib/supabase/server"

export const handleTopicToAccount = async (topic: string) => {
  const supabase = createClient()

  const {
    data,
    error
  } = await supabase.functions.invoke("handle_topic", {
    body: {
      topic,
    },
  })
}
