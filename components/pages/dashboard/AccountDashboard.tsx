"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { type NewslettersTopics } from "types/common/newsletter"

type AccountDashboardType = {
  topic: NewslettersTopics
}

export default function AccountDashboard({ topic }: AccountDashboardType) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Você tá inscrito na newsletter de;</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tighter sm:text-5xl">{topic.name}</h2>
        <p className="text-lg text-muted-foreground">{topic.summary}</p>
      </CardContent>
    </Card>
  )
}
