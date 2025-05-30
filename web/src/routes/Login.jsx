import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/api/AuthProvider";
import { Lock, LockKeyhole } from "lucide-react";
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
    const remember = formData.get('remember') == "on";
    auth.loginEmailPassword(email, password, remember).then(
      () => { 
        toast.success("Sikeres bejelentkezés!")
        navigate(redirectTo); 
      },
      (error) => { 
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
      <Card className="max-w-80 w-full">
        <CardHeader className="font-bold text-xl flex flex-col items-center gap-2">
          <div className="bg-primary-foreground p-2 rounded-full">
            <LockKeyhole />
          </div>
          Bejelentkezés
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="space-y-1">
            <p>Email</p>
            <Input name="email" type="email" placeholder="email@example.com" />
          </div>
          <div className="space-y-1">
            <p>Jelszó</p>
            <Input name="password" type="password" placeholder="********" />
          </div>
          <div className="flex gap-2">
            <Switch name={"remember"} />
            Maradjak bejelentkezve
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="font-bold flex-1">Bejelentkezés</Button>
        </CardFooter>
      </Card>
    </form>
  )
}