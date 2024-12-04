import { ArrowRight, CheckCircle, Github, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"

export default function Web() {
  return (
    <div className="flex min-w-full flex-col">
      <header className="flex h-14 items-center border-b px-4 lg:px-6">
        <Link className="flex items-center justify-center" href="#">
          <span className="text-xl font-bold">DesignAI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium underline-offset-4 hover:underline" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium underline-offset-4 hover:underline" href="#how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium underline-offset-4 hover:underline" href="#pricing">
            Pricing
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Design Smarter, Not Harder
                  </h1>
                  <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
                    DesignAI revolutionizes your creative process. Harness the power of AI to generate stunning designs
                    in seconds.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg">
                      Get Started
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">
                    Watch Demo
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  unoptimized
                  src="https://placehold.co/600x400.png"
                  width={600}
                  height={400}
                  alt="AI-generated design showcase"
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full bg-gray-100 py-12 dark:bg-gray-800 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">Powerful Features</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-primary">
                    <CheckCircle className="size-10 text-primary-foreground" />
                  </div>
                  <CardTitle>AI-Powered Designs</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Generate unique designs based on your preferences and brand guidelines.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-primary">
                    <CheckCircle className="size-10 text-primary-foreground" />
                  </div>
                  <CardTitle>Customizable Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Start with AI-generated templates and customize them to perfection.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-primary">
                    <CheckCircle className="size-10 text-primary-foreground" />
                  </div>
                  <CardTitle>Collaboration Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Work seamlessly with your team in real-time on design projects.</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex items-center justify-center">
                <Image
                  unoptimized
                  src="https://placehold.co/600x400.png"
                  width={600}
                  height={400}
                  alt="DesignAI workflow demonstration"
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <ol className="space-y-4">
                  <li className="flex items-center space-x-4">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      1
                    </div>
                    <p className="text-xl">Input your design preferences and requirements</p>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      2
                    </div>
                    <p className="text-xl">AI generates multiple design options</p>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      3
                    </div>
                    <p className="text-xl">Choose and customize your favorite design</p>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      4
                    </div>
                    <p className="text-xl">Export and use your finalized design</p>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full bg-gray-100 py-12 dark:bg-gray-800 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">Pricing Plans</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <CardDescription>For individuals and small teams</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 text-4xl font-bold">$19/mo</div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 size-5 text-green-500" />
                      100 AI-generated designs/mo
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 size-5 text-green-500" />
                      Basic templates
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 size-5 text-green-500" />
                      Email support
                    </li>
                  </ul>
                  <Button className="mt-4 w-full">Choose Basic</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For growing businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 text-4xl font-bold">$49/mo</div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 size-5 text-green-500" />
                      Unlimited AI-generated designs
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 size-5 text-green-500" />
                      Advanced templates
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 size-5 text-green-500" />
                      Priority support
                    </li>
                  </ul>
                  <Button className="mt-4 w-full">Choose Pro</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>For large organizations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 text-4xl font-bold">Custom</div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 size-5 text-green-500" />
                      Unlimited everything
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 size-5 text-green-500" />
                      Custom AI model training
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 size-5 text-green-500" />
                      Dedicated account manager
                    </li>
                  </ul>
                  <Button className="mt-4 w-full">Contact Sales</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Transform Your Design Process?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                  Join thousands of designers and businesses already using DesignAI to create stunning visuals in record
                  time.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button className="w-full" size="lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 DesignAI. All rights reserved.</p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Privacy Policy
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="#" aria-label="DesignAI on GitHub">
            <Github className="size-5" />
          </Link>
          <Link href="#" aria-label="DesignAI on Twitter">
            <Twitter className="size-5" />
          </Link>
        </div>
      </footer>
    </div>
  )
}
