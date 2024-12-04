import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card>
        <CardHeader className="font-bold text-xl text-center">Login</CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
        </CardContent>
        <CardFooter>
          <Button className="mr-auto font-bold">Login</Button>
          <Button className="font-bold" variant="outline">Register</Button>
        </CardFooter>
      </Card>
    </div>
  )
}