import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/api/AuthProvider"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { LockKeyhole } from "lucide-react"

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
    <form onSubmit={handleLogin} className="w-full">
      <Card className="shadow-xl border-none overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-1 absolute inset-0 top-0 h-1"></div>
        <CardHeader className="space-y-3 pb-2 pt-6">
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <LockKeyhole className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1 text-center">
            <CardTitle className="text-2xl">Bejelentkezés</CardTitle>
            <CardDescription>Adja meg az adatait a folytatáshoz</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Input 
                name="email" 
                id="email" 
                type="email" 
                placeholder="name@example.com"
                className="bg-white/5 border-white/10"
                required 
              />
            </motion.div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">Jelszó</label>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Input 
                name="password" 
                id="password" 
                type="password" 
                placeholder="••••••••"
                className="bg-white/5 border-white/10"
                required 
              />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center"
          >
            <div className="flex items-center space-x-2">
              <Switch id="remember" name="remember" />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Maradjak bejelentkezve
              </label>
            </div>
          </motion.div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full"
          >
            <Button 
              type="submit" 
              className="w-full font-medium"
              variant="primaryGradient"
            >
              Bejelentkezés
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </form>
  )
}
