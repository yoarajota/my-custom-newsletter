import DashboardHandler from "@components/pages/dashboard/DashboardHandler"
import { Card, CardContent } from "@components/ui/card"
import { getAccounts, getBillingStatus } from "app/[locale]/actions"
import { Account } from "types/auth"
import { NewslettersTopics } from "types/common/newsletter"
import { queryAssignedUserTopic } from "./actions"

type WebProps = {
  params: {
    locale: string
  }
}

export default async function Web({ params: { locale } }: WebProps) {
  const billingStatus = await getBillingStatus()

  let account: Account | undefined
  let assignedTopic: NewslettersTopics | null = null

  const activeBilling = billingStatus?.status === "active"

  if (activeBilling) {
    account = (await getAccounts())[0]

    assignedTopic = await queryAssignedUserTopic(account?.account_id)
  }

  return (
    <div className="mx-auto px-4 py-12">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {activeBilling && <DashboardHandler assignedTopic={assignedTopic} locale={locale} />}
        </CardContent>
      </Card>
    </div>
  )
}
