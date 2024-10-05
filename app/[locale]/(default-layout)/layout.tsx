import { LayoutProps } from "types/common"
import DefaultLayout from "@components/Structure/DefaultLayout"

export default async function RootLayout({ children }: Readonly<LayoutProps>) {
  return <DefaultLayout>{children}</DefaultLayout>
}
