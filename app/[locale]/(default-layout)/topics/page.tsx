import DashboardHandler from "@components/pages/dashboard/DashboardHandler"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { getAccounts } from "app/[locale]/actions"
import { NewslettersTopics } from "types/common/newsletter"
import { getUserTopics } from "./actions"

type WebProps = {
  params: {
    locale: string
  }
}

export default async function Web({ params: { locale } }: WebProps) {
  const [account] = await getAccounts()
  const topics = await getUserTopics(account?.account_id)

  console.log(topics)

  return (
    <div className="flex h-full flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {topics &&
          topics.map((topic) => (
            <Card key={topic.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{topic.name}</CardTitle>
                <CardDescription>{topic.summary}</CardDescription>
              </CardHeader>
              <CardContent className="p-0"></CardContent>
            </Card>
          ))}
      </div>
      <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  )
}
