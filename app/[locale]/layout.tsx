import { Inter as FontSans } from "next/font/google"
import { cn } from "@lib/utils"
import { type LayoutProps } from "@types/common"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({ children, params: { locale } }: Readonly<LayoutProps>) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>{children}</body>
    </html>
  )
}
