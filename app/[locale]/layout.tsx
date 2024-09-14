import { Inter as FontSans } from "next/font/google"
import { cn } from "@lib/utils"
import { type LayoutProps } from "types/common"
import Layout from "@components/Structure/Layout"
import { headers } from "next/headers"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({ children, params: { locale } }: Readonly<LayoutProps>) {
  const headersList = headers()
  const header_url = headersList.get("x-pathname") || ""

  const isDashboard = header_url === `/${locale}`
  const isAuthPath = header_url.includes("/auth")

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn("flex min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        {!isDashboard && !isAuthPath && <Layout>{children}</Layout>}

        {isAuthPath && children}
      </body>
    </html>
  )
}
