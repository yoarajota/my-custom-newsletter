"use client"

import { useState } from "react"
import { NewslettersTopics } from "types/common/newsletter"
import AccountDashboard from "./AccountDashboard"
import AssignTopicToAccountForm from "./AssignTopicToAccountForm"

type DashboardHandlerProps = {
  locale: string
  assignedTopic: NewslettersTopics | null
}

export default function DashboardHandler({ locale, assignedTopic }: DashboardHandlerProps) {
  const [userAssignedTopic, setUserAssignedTopic] = useState<NewslettersTopics | null>(assignedTopic)

  return !userAssignedTopic ? (
    <AssignTopicToAccountForm locale={locale} setUserAssignedTopic={setUserAssignedTopic} />
  ) : (
    <AccountDashboard />
  )
}
