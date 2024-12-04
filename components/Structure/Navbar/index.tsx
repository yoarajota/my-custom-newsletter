import { Bell, Package2 } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import { Button } from "@components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { getInitials } from "@lib/utils"
import config from "app-config"
import { Auth, BillingStatus } from "types/auth"
import NavItem from "./NavItem"
import UpgradeButton from "./UpgradeButton"
import { NAV_ITEMS } from "../utils"
const { app_name } = config

export default async function Navbar({ auth, billingStatus }: { auth: Auth; billingStatus: BillingStatus }) {
  let subscriptionActive: boolean = false

  if (billingStatus) {
    subscriptionActive = billingStatus.subscription_active
  }

  const realMenuItems = useMemo(() => {
    return NAV_ITEMS.filter((item) => (billingStatus.billing_enabled && item.need_plan) || !item.need_plan)
  }, [billingStatus])

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="size-6" />
            <span>{getInitials(app_name)}</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto size-8">
            <Bell className="size-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {realMenuItems.map((item, index) => (
              <NavItem key={index} {...item} />
            ))}
          </nav>
        </div>
        {!subscriptionActive && (
          <div className="mt-auto p-4">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>Unlock all features and get unlimited access to our support team.</CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <UpgradeButton accountId={auth.account?.account_id} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
