import { Mail } from "lucide-react"
import { Button } from "@components/ui/button"
import { Card, CardContent, CardFooter } from "@components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@components/ui/carousel"
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

interface EmailCardProps {
  id: string
  email: string
}

function EmailCard({ id, email }: EmailCardProps) {
  return (
    <Card className="flex h-[200px] w-[300px] flex-col">
      <CardContent className="grow overflow-hidden p-4">
        <div className="mb-2 text-sm font-medium">Email ID: {id}</div>
        <div
          className="overflow-hidden text-xs text-muted-foreground"
          style={{ display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical" }}
        >
          {email}
        </div>
      </CardContent>
      <CardFooter className="p-2">
        <Button variant="outline" size="sm" className="w-full">
          View Full Email
        </Button>
      </CardFooter>
    </Card>
  )
}

type WebProps = {
  params: {
    locale: string
    id: string
  }
}

export default async function Web({ params: { locale, id } }: WebProps) {
  const emails = await getAllEmailsFromTopic(id)

  return (
    <div className="flex h-full flex-1 flex-col gap-4 p-4">
      {emails?.length && emails?.length > 0 ? (
        <Carousel className="mx-auto w-full max-w-xs">
          <CarouselContent>
            {emails.map((email) => (
              <CarouselItem key={email.id}>
                <EmailCard id={email.id} email={email.email} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
