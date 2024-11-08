"use client"

import { Badge } from "lucide-react"
import * as Icons from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavItem = ({
  icon,
  title,
  href,
  badge,
}: {
  icon: string
  title: string
  active?: boolean
  href: string
  badge?: number
}) => {
  const path = usePathname()

  const active = path.includes(href)

  let classes = "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"

  if (active) {
    classes =
      "mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
  }

  const Icon = Icons[icon]

  return (
    <Link href={href} className={classes}>
      {Icon && <Icon className="size-5" />}
      {title}
      {badge && (
        <Badge className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full">{badge}</Badge>
      )}
    </Link>
  )
}

export default NavItem
