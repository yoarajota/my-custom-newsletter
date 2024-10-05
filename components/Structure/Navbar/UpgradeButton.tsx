"use client"

import { useRouter } from "next/navigation"
import { Button } from "@components/ui/button"
import { subscribeToDefaultPlan } from "app/[locale]/actions"

export default function UpgradeButton({ accountId }: { accountId: string | undefined }) {
  const router = useRouter()

  return (
    <Button
      size="sm"
      className="w-full"
      onClick={() =>
        subscribeToDefaultPlan(accountId).then((url) => {
          router.push(url)
        })
      }
    >
      Upgrade
    </Button>
  )
}
