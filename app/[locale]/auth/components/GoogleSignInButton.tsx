"use client"

import { Button } from "@components/ui/button"

import { googleSignIn } from "app/actions"

const GoogleSignInButton = () => {
  return (
    <Button className="w-full" onClick={() => googleSignIn()}>
      Login with Google
    </Button>
  )
}

export default GoogleSignInButton
