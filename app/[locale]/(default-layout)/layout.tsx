import DefaultLayout from "@components/Structure/DefaultLayout"
import { LayoutProps } from "types/common"

export default async function RootLayout({ children }: Readonly<LayoutProps>) {
  return <DefaultLayout>{children}</DefaultLayout>
}
