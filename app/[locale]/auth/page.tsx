import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import GoogleSignInButton from "./components/GoogleSignInButton"

export default function Web() {
  return (
    <Card className="m-auto min-w-[300px] max-w-3xl md:min-w-[400px]">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Start reading!</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button> */}

          <GoogleSignInButton />
        </div>
      </CardContent>
    </Card>
  )
}
