import DashboardHandler from "@components/pages/dashboard/DashboardHandler"
import { Card, CardContent } from "@components/ui/card"
import { getAccounts } from "app/[locale]/actions"
import { NewslettersTopics } from "types/common/newsletter"
import { queryAssignedUserTopic } from "./actions"

type WebProps = {
  params: {
    locale: string
  }
}

export default async function Web({ params: { locale } }: WebProps) {
  const [account] = await getAccounts()

  const assignedTopic: NewslettersTopics | null = await queryAssignedUserTopic(account?.account_id)

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <DashboardHandler assignedTopic={assignedTopic} locale={locale} />
        </CardContent>
      </Card>
    </div>
  )
}
