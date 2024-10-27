import Header from "@components/Structure/Header"
import Main from "@components/Structure/Main"
import Navbar from "@components/Structure/Navbar"
import { getAuth, getBillingStatus } from "app/[locale]/actions"
import { Auth } from "types/auth"
import { ChildProps } from "types/common"

export const dynamic = "force-dynamic"

export default async function DefaultLayout({ children }: ChildProps) {
  const [auth, billingStatus] = await Promise.all([getAuth(), getBillingStatus()])

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Navbar billingStatus={billingStatus} auth={auth} />

      <div className="flex flex-col">
        <Header billingStatus={billingStatus} auth={auth} />

        <Main>{children}</Main>
      </div>
    </div>
  )
}
