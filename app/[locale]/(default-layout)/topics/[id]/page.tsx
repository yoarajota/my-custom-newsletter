type WebProps = {
  params: {
    locale: string
  }
}

export default async function Web({ params: { locale } }: WebProps) {
  return <div className="flex h-full flex-1 flex-col gap-4 p-4"></div>
}
