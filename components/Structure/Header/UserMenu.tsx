"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { type User } from "@supabase/supabase-js"

import { CircleUser } from "lucide-react"
import { Button } from "@components/ui/button"

export default function UserMenu({ user }: { user: User | null }) {
  return (
    <Button variant="secondary" size="icon" className="overflow-hidden rounded-full">
      <Avatar>
        {user?.user_metadata?.avatar_url ? (
          <AvatarImage src={user.user_metadata.avatar_url} alt="@shadcn" />
        ) : (
          <AvatarFallback>CN</AvatarFallback>
        )}
      </Avatar>
    </Button>
  )
}
