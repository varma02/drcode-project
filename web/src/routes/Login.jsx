import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/api/AuthProvider";
import { OctagonX, ShieldCheck } from "lucide-react";
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
        toast("Sikeres bejelentkezés!", {icon: <ShieldCheck />})
        navigate(redirectTo); 
      },
      (error) => { 
        switch (error.response.data.code) {
          case "fields_required":
            return toast("Az email vagy a jelszó mező üres!", {icon: <OctagonX className="text-destructive" />})
          case "invalid_credentials":
            return toast("Helytelen email vagy jelszó!", {icon: <OctagonX className="text-destructive" />})
          default:
            return toast("Ismeretlen hiba történt!", {icon: <OctagonX className="text-destructive" />})
        }
      }
    );
  }

  return (
    <form className="flex justify-center items-center min-h-screen"
    onSubmit={handleLogin}>
      <Card>

        {/* TODO: REMOVE THIS */}
        <input type="button" value="Temporarily bypass login (DEV ONLY)" className="p-2 bg-red-900 m-2 rounded cursor-pointer"
        onClick={() => {auth.bypassLogin();navigate(redirectTo)}} />

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