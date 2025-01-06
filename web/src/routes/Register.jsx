import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/api/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export default function LoginPage() {

  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get('redirect') || "/";
  const navigate = useNavigate();
  const auth = useAuth();

  function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    auth.loginEmailPassword(email, password, false).then(
      () => { 
        toast.success("Sikeres bejelentkezés!")
        navigate(redirectTo); 
      },
      (error) => { 
        console.error(error);
        switch (error.response?.data?.code) {
          case "fields_required":
            return toast.error("Az email vagy a jelszó mező üres!")
          case "invalid_credentials":
            return toast.error("Helytelen email vagy jelszó!")
          default:
            return toast.error("Ismeretlen hiba történt!")
        }
      }
    );
  }

  return (
    <form className="flex justify-center items-center min-h-screen"
    onSubmit={handleLogin}>
      <Card>
        <CardHeader className="font-bold text-xl text-center">Bejelentkezés</CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input name="email" type="email" placeholder="Email" />
          <Input name="password" type="password" placeholder="Password" />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="font-bold flex-1">Bejelentkezés</Button>
        </CardFooter>
      </Card>
    </form>
  )
}