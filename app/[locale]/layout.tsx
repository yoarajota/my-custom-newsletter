import { Inter as FontSans } from "next/font/google"
import { headers } from "next/headers"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import Layout from "@components/Structure/Layout"
import { cn } from "@lib/utils"
import { type LayoutProps } from "@types/common"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default async function RootLayout({ children, params: { locale } }: Readonly<LayoutProps>) {
  const headersList = headers()
  const header_url = headersList.get("x-pathname") || ""

  const isHome = header_url === `/${locale}`
  const isAuthPath = header_url.includes("/auth")

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn("flex min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <NextIntlClientProvider messages={messages}>
          <>
            {!isHome && !isAuthPath && <Layout>{children}</Layout>}

            {isAuthPath && children}
          </>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
