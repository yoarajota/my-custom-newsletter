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

  let classes = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"

  if (active) {
    classes = "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
  }

  // @ts-ignore
  const Icon = Icons[icon]

  return (
    <Link href={href} className={classes}>
      {Icon && <Icon className="size-4" />}
      <>{title}</>
      {badge && (
        <Badge className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full">{badge}</Badge>
      )}
    </Link>
  )
}

export default NavItem
