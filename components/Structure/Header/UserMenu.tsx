"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

import { useCallback } from "react"
import { Button } from "@components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu"
import { Auth } from "@types/auth"

export default function UserMenu({ auth }: { auth: Auth }) {
  const { user, account } = auth

  const fbString = useCallback((str: string) => {
    return str ? str.charAt(0).toUpperCase() : ""
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="overflow-hidden rounded-full">
          <Avatar className="select-none">
            {user?.user_metadata?.avatar_url ? (
              <AvatarImage src={user.user_metadata.avatar_url} alt={account?.name ?? "Profile"} />
            ) : (
              <AvatarFallback>{fbString(account?.name ?? "U")}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={console.log}>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
