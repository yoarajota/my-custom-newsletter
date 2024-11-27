import Link from "next/link"
import { Button } from "@components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { type NewslettersTopics } from "types/common/newsletter"

type AccountDashboardType = {
  topic: NewslettersTopics
}

export default function AccountDashboard({ topic }: AccountDashboardType) {
  return (
    <Card className="max-w-[600px]">
      <CardHeader>
        <CardDescription>Você tá inscrito na newsletter de;</CardDescription>
        <CardTitle>{topic.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <p className="text-lg text-muted-foreground">{topic.summary}</p>

        <Button className="mx-auto">
          <Link href="/newsletters/topics">Visite os posts existentes dessa newsletter</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
