"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { Button } from "@components/ui/button"
import { Card, CardContent, CardFooter } from "@components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog"
import { Input } from "@components/ui/input"
import { Label } from "@components/ui/label"
import { DialogEmailVisualizer } from "./DialogEmailVisualizer"

interface EmailCardProps {
  id: string
  html: string
  setSelectedEmailHtml: Dispatch<SetStateAction<string | null>>
}

function EmailCard({ id, html, setSelectedEmailHtml }: EmailCardProps) {
  return (
    <Card className="flex h-[200px] w-[300px] flex-col">
      <CardContent className="grow overflow-hidden p-4">
        <div className="mb-2 text-sm font-medium">Email ID: {id}</div>
        <div
          className="overflow-hidden text-xs text-muted-foreground"
          style={{ display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical" }}
        >
          {html}
        </div>
      </CardContent>
      <CardFooter className="p-2">
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedEmailHtml(html)}>
            View Full Email
          </Button>
        </DialogTrigger>
      </CardFooter>
    </Card>
  )
}

export function MapEmails({ emails }: { emails: { id: string; html: string }[] }) {
  const [selectedEmailHtml, setSelectedEmailHtml] = useState<null | string>(null)

  return (
    <>
      <Dialog>
        <Carousel className="mx-auto w-full max-w-xs">
          <CarouselContent>
            {emails.map(({ html, id }) => (
              <CarouselItem key={id}>
                <EmailCard id={id} html={html} setSelectedEmailHtml={setSelectedEmailHtml} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <DialogEmailVisualizer html={selectedEmailHtml} />
      </Dialog>
    </>
  )
}
