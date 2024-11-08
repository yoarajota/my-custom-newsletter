"use client"

import { type NewslettersTopics } from "types/common/newsletter"

type AccountDashboardType = {
  topic: NewslettersTopics
}

export default function AccountDashboard({ topic }: AccountDashboardType) {
  return <div className="">{JSON.stringify(topic)}</div>
}
