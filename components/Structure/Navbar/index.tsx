import { Bell, Home, LineChart, LucideIcon, Package, Package2, ShoppingCart, Users } from "lucide-react"
import Link from "next/link"
import { memo } from "react"
import { Badge } from "@components/ui/badge"
import { Button } from "@components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { getBillingStatus, subscribeToDefaultPlan } from "app/[locale]/actions"
import config from "app-config"
import { Auth } from "types/auth"
import UpgradeButton from "./UpgradeButton"
const { app_name } = config

const NavItem = memo(
  ({
    Icon,
    title,
    active,
    href,
    badge,
  }: {
    Icon: LucideIcon
    title: string
    active?: boolean
    href: string
    badge?: number
  }) => {
    return (
      <Link
        href={href}
        className={
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary" +
          (active ? " text-primary" : " text-muted-foreground")
        }
      >
        {Icon && <Icon className="size-4" />}
        <>{title}</>
        {badge && (
          <Badge className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full">{badge}</Badge>
        )}
      </Link>
    )
  },
  (prevProps, nextProps) => prevProps.active === nextProps.active
)

// Definindo o displayName para o componente memoizado
NavItem.displayName = "NavItem"

export default async function Navbar({ auth }: { auth: Auth }) {
  const billingStatus = await getBillingStatus()

  let subscriptionActive: boolean = false

  if (billingStatus) {
    subscriptionActive = billingStatus.subscription_active
  }

  const navItems = [
    {
      Icon: Home,
      title: "Dashboard",
      href: "/",
    },
    {
      Icon: ShoppingCart,
      title: "Orders",
      href: "/orders",
      badge: 6,
    },
    {
      Icon: Package,
      title: "Products",
      href: "/products",
    },
    {
      Icon: Users,
      title: "Customers",
      href: "/customers",
    },
    {
      Icon: LineChart,
      title: "Analytics",
      href: "/analytics",
    },
  ]

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="size-6" />
            <span className="">{app_name}</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto size-8">
            <Bell className="size-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item, index) => (
              <NavItem key={index} {...item} />
            ))}
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Home className="size-4" />
              Dashboard
            </Link>
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
