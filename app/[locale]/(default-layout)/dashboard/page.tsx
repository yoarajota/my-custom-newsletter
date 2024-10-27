"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@components/ui/button"
import { Card, CardContent } from "@components/ui/card"
import { Input } from "@components/ui/input"

export default function Web() {
  const [topic, setTopic] = useState("")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log("Form submitted:", { topic })
    // Here you would typically send the form data to your backend
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 p-8 lg:p-12">
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary">Vamos iniciar sua experiência!</h1>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                <Button type="submit" size="lg" className="w-full">
                  Vamos!
                </Button>
              </form>
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
        </CardContent>
      </Card>
    </div>
  )
}
