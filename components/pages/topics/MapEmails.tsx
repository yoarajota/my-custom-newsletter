"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { Button } from "@components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@components/ui/card"
import { Dialog, DialogTrigger } from "@components/ui/dialog"

interface EmailCardProps {
  id: string
  html: string
  date: string
  setSelectedEmailHtml: Dispatch<SetStateAction<string | null>>
}

function EmailCard({ id, date, html, setSelectedEmailHtml }: EmailCardProps) {
  const dateStr = new Date(date).toLocaleDateString()

  return (
    <Card className="cursor-pointer flex-col" onClick={() => setSelectedEmailHtml(html)}>
      <CardHeader>
        <CardTitle>Newsletter de {dateStr}</CardTitle>
      </CardHeader>
    </Card>
  )
}

export function MapEmails({ emails }: { emails: { id: string; html: string; created_at: string }[] }) {
  const [selectedEmailHtml, setSelectedEmailHtml] = useState<null | string>(null)

  return (
    <div className="flex gap-4">
      <div className="flex w-1/2 flex-col gap-4">
        {emails.map(({ html, created_at, id }) => (
          <div key={id}>
            <EmailCard id={id} date={created_at} html={html} setSelectedEmailHtml={setSelectedEmailHtml} />
          </div>
        ))}
      </div>

      {selectedEmailHtml && <span className="flex-1" dangerouslySetInnerHTML={{ __html: selectedEmailHtml ?? "" }} />}
    </div>
  )
}
