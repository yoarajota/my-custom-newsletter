"use client"

import { Button } from "@components/ui/button"
import useAuth from "@lib/store/auth"

const GoogleSignInButton = () => {
  const { signIn } = useAuth()

  return (
    <Button
      className="w-full"
      onClick={(e) => {
        e.preventDefault()
        signIn("google")
      }}
    >
      Login with Google
    </Button>
  )
}

export default GoogleSignInButton
