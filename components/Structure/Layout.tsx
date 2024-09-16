import Header from "@components/Structure/Header"
import Main from "@components/Structure/Main"
import Navbar from "@components/Structure/Navbar"
import { ChildProps } from "@types/common"

export default function Layout({ children }: ChildProps) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Navbar />

      <div className="flex flex-col">
        <Header />

        <Main>{children}</Main>
      </div>
    </div>
  )
}
