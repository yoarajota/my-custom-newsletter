import Link from "next/link"
import DashboardHandler from "@components/pages/dashboard/DashboardHandler"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Separator } from "@components/ui/separator"
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

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <span>Newsletters que você está inscrito;</span>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {topics &&
          topics.map((topic) => (
            <Link key={topic.id} href={`/topics/${topic.id}`} className="block">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{topic.name}</CardTitle>
                  <CardDescription>{topic.summary}</CardDescription>
                </CardHeader>
                <CardContent className="p-0"></CardContent>
              </Card>
            </Link>
          ))}
      </div>
      <Separator />
    </div>
  )
}
