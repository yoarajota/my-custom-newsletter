import { Mail } from "lucide-react"
import { DialogEmailVisualizer } from "@components/pages/topics/DialogEmailVisualizer"
import { MapEmails } from "@components/pages/topics/MapEmails"
import { Button } from "@components/ui/button"
import { Card, CardContent, CardFooter } from "@components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@components/ui/carousel"
import { Dialog, DialogTrigger } from "@components/ui/dialog"
import { getAllEmailsFromTopic, getUserTopics } from "../actions"

function EmptyState() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <Mail className="mb-4 size-12 text-gray-400" />
        <h2 className="mb-2 text-xl font-semibold text-gray-700">No Emails Found</h2>
        <p className="text-center text-sm text-gray-500">
          There are no AI-generated emails for this topic yet. Check back later or try a different topic.
        </p>
      </CardContent>
    </Card>
  )
}

type WebProps = {
  params: {
    locale: string
    topic_id: string
  }
}

export default async function Web({ params: { locale, topic_id } }: WebProps) {
  const emails = await getAllEmailsFromTopic(topic_id)

  return (
    <div className="flex h-full flex-1 flex-col gap-4 p-4">
      {emails?.length && emails?.length > 0 ? <MapEmails emails={emails} /> : <EmptyState />}
    </div>
  )
}
