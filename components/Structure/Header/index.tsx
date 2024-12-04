import { Menu, Package2, Search } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import { Button } from "@components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Input } from "@components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@components/ui/sheet"
import config from "app-config"
import { Auth, BillingStatus } from "types/auth"
import NavItem from "./NavItem"
import UserMenu from "./UserMenu"
import { NAV_ITEMS } from "../utils"
const { app_name } = config

export default async function Header({ auth, billingStatus }: { auth: Auth; billingStatus: BillingStatus }) {
  const realMenuItems = useMemo(() => {
    return NAV_ITEMS.filter((item) => (billingStatus.billing_enabled && item.need_plan) || !item.need_plan)
  }, [billingStatus])

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
            {realMenuItems.map((item, index) => (
              <NavItem key={index} {...item} />
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
