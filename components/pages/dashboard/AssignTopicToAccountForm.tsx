"use client"

import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { handleTopicToAccount } from "app/[locale]/(default-layout)/dashboard/actions"
import { NewslettersTopics } from "types/common/newsletter"

export default function AssignTopicToAccountForm({
  locale,
  setUserAssignedTopic,
}: {
  locale: string
  setUserAssignedTopic: Function
}) {
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault()

    setLoading(true)

    // const { data, error } = await handleTopicToAccount(topic, locale)

    await new Promise(async (res) => {
      await setTimeout(() => {
        res(true)
      }, 4000)
    })

    const data = {
      status: "success",
    }

    const error = null

    if (!data || error) {
      setLoading(false)
    }

    if (data?.status === "success") {
      setTopic("")

      setUserAssignedTopic(data.topic as NewslettersTopics)
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1 p-8 lg:p-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary">Vamos iniciar sua experiência!</h1>
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-foreground">Insira um tema que você ama!</h2>
            <p className="mb-4 text-lg text-muted-foreground">
              Você receberá semanalmente conteúdos sobre esse tema em seu email.
            </p>
            <div className="space-y-2">
              <Input
                placeholder="ex: Futebol de Salão (Futsal)"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="text-lg"
              />
            </div>
          </div>
          <Button onClick={handleSubmit} size="lg" className="w-full" disabled={loading || topic.length === 0}>
            {loading && <Loader2 className="animate-once animate-fade-right animate-spin" />}
            Vamos!
          </Button>
        </div>
      </div>
      <div className="relative min-h-[300px] flex-1 lg:min-h-[500px]">
        <Image
          unoptimized
          src="https://placehold.co/600x400.png"
          alt="DesignAI workflow demonstration"
          layout="fill"
          objectFit="cover"
          className="rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none"
        />
      </div>
    </div>
  )
}
