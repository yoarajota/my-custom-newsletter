import { getAllEmailsFromTopic, getUserTopics } from "../actions"

type WebProps = {
  params: {
    locale: string
    id: string
  }
}

export default async function Web({ params: { locale, id } }: WebProps) {
  const emails = await getAllEmailsFromTopic(id)

  console.log(emails)

  return (
    <div className="flex h-full flex-1 flex-col gap-4 p-4">
      {emails?.map((topic) => {
        return (
          <div key={topic.id} className="flex flex-col gap-4">
            <h1>Topic</h1>
            <h2>Topic</h2>
            <h3>Topic</h3>
            <p>Topic</p>
          </div>
        )
      })}
    </div>
  )
}
