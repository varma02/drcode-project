import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { register } from "@/lib/api/api";
import { useAuth } from "@/lib/api/AuthProvider";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = useAuth();

  function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const password_again = formData.get('password-again');
    if (password !== password_again) {
      return toast.error("A megadott jelszavak nem egyeznek!");
    }
    const invite = "invite:" + searchParams.get('invite');
    register(invite, name, email, password).then(
      () => { 
        toast.success("Sikeres regisztráció!");
        auth.loginEmailPassword(email, password).then(() => {
          toast.success("Sikeres bejelentkezés!");
        }).catch((error) => {
          console.error(error);
          switch (error.response?.data?.code) {
            case "fields_required":
              return toast.error("Az email vagy a jelszó mező üres!")
            case "invalid_credentials":
              return toast.error("Helytelen email vagy jelszó!")
            default:
              return toast.error("Ismeretlen hiba történt!")
          }
        }).finally(() => navigate("/"));
      },
      (error) => { 
        console.error(error);
        switch (error.response?.data?.code) {
          case "fields_required":
            return toast.error("Az email vagy a jelszó mező üres!")
          case "invalid_password":
            return toast.error("A megadott jelszó nem felel meg az elvárásoknak!")
          case "invalid_invite":
            return toast.error("Ez a meghívó már lejárt!")
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
        <CardHeader className="font-bold text-xl text-center">Regisztráció</CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input name="name" type="text" placeholder="Név" />
          <Input name="email" type="email" placeholder="Email" />
          <Input name="password" type="password" placeholder="Jelszó" />
          <Input name="password-again" type="password" placeholder="Jelszó megerősítése" />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="font-bold flex-1">Regisztráció</Button>
        </CardFooter>
      </Card>
    </form>
  )
}