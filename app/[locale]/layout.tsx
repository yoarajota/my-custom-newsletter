import { Inter as FontSans } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { Toaster } from "@components/ui/sonner"
import { cn } from "@lib/utils"
import type { LayoutProps } from "types/common"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default async function RootLayout({ children, params: { locale } }: Readonly<LayoutProps>) {
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn("flex min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>

        <Toaster />
      </body>
    </html>
  )
}
