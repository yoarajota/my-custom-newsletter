import type { LayoutProps } from "types/common"
import "styles/tailwind.css"
import "./globals.css"
import { Toaster } from "sonner"

export default function RootLayout({ children }: Readonly<LayoutProps>) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
