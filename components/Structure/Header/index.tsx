import { Home, LineChart, Menu, Package, Package2, Search, ShoppingCart, Users } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { Badge } from "@components/ui/badge"
import { Button } from "@components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Input } from "@components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@components/ui/sheet"
import config from "app-config"
import { Auth, BillingStatus } from "types/auth"
import UserMenu from "./UserMenu"
import { NAV_ITEMS } from "../utils"
const { app_name } = config

const NavItem = ({
  Icon,
  title,
  active,
  href,
  badge,
}: {
  Icon: React.ElementType
  title: string
  active?: boolean
  href: string
  badge?: number
}) => {
  let classes = "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"

  if (active) {
    classes =
      "mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
  }

  return (
    <Link href="#" className={classes}>
      <Icon className="size-5" />
      {title}
      {badge && (
        <Badge className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full">{badge}</Badge>
      )}
    </Link>
  )
}

export default async function Header({ auth, billingStatus }: { auth: Auth; billingStatus: BillingStatus }) {
  const heads = headers()

  const url = heads.get("referer")

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link href="#" className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Package2 className="size-6" />
              <span className="sr-only">{app_name}</span>
            </Link>
            {NAV_ITEMS.map((item, index) => (
              <NavItem key={index} {...item} active={url?.includes?.(item.href)} />
            ))}
          </nav>
          <div className="mt-auto">
            <Card>
              <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>Unlock all features and get unlimited access to our support team.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <UserMenu auth={auth} />
    </header>
  )
}
