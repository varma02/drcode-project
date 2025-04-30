import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { update } from '@/lib/api/api';
import { useAuth } from '@/lib/api/AuthProvider';
import { Pen } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

export default function Settings() {
  const auth = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (formData.get("new_password") !== formData.get("new_password_again")) {
      toast.error("A megadott új jelszavak nem egyeznek!");
      return;
    }
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      old_password: formData.get("old_password"),
      new_password: formData.get("new_password"),
    }
    update(auth.token, 'auth', auth.user.id, data)
    .then(() => toast.success("Profil módosítva!"))
    .catch((error) => { 
      console.error(error);
      switch (error.response?.data?.code) {
        case "fields_required":
        case "fields_invalid":
          return toast.error("Az egyik mező hibás vagy helytelen jelszó!")
        case "bad_request":
          return toast.error("Helytelen jelszó!")
        case "password_too_weak":
          return toast.error("Az új jelszó nem elég erős!")
        default:
          return toast.error("Ismeretlen hiba történt!")
      }
    });
  }
  

  return (
    <div className='flex flex-col items-center w-full p-4 pt-10'>
      <div className='max-w-[600px] w-full bg-[#18181b] rounded-xl'>
        <h2 className='sr-only'>Beállíások</h2>
        <div className={`${auth.user.roles.includes("administrator") ? "bg-red-500" : "bg-green-500"} px-4 py-2 rounded-t-xl relative h-14`}></div>
        <form className='text-right min-h-20 flex gap-2 px-4 mb-4 flex-col sm:flex-row' onSubmit={handleSubmit}>
          <div className='sm:min-w-36 sm:min-h-36 min-h-24 relative'>
            <Avatar className="min-w-36 min-h-36 absolute border-4 border-[#18181b] -top-10">
              <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
              <AvatarFallback className="text-4xl font-bold">{auth.user.name.split(" ").slice(0, 2).map(v => v[0]).join("")}</AvatarFallback>
            </Avatar>
            <input type="file" className='absolute w-36 h-36 bg-red-500 rounded-full opacity-0 peer cursor-pointer -top-10 left-0' />
            <div className='pointer-events-none absolute min-w-36 min-h-36 flex justify-center items-center peer-hover:bg-black/30 opacity-0 peer-hover:opacity-100 rounded-full transition-all duration-300 -top-10'><Pen /></div>
            <Button className="hidden sm:block absolute bottom-0 left-0 w-full font-bold" type="submit">Mentés</Button>
          </div>
          <div className='w-full flex flex-col pt-6 p-4 gap-4'>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name" className="text-left">Teljes név *</Label>
              <Input name="name" type="text" id="name" placeholder="Minta Péter" required defaultValue={auth.user.name} />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email" className="text-left">E-mail cím *</Label>
              <Input name="email" type="email" id="email" placeholder="minta.peter@example.com" required defaultValue={auth.user.email} />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="old_password" className="text-left">Jelenlegi jelszó *</Label>
              <Input name="old_password" required type="password" id="old_password" />
            </div>
            <Separator />
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="new_password" className="text-left">Új jelszó</Label>
              <Input name="new_password" type="password" id="new_password" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="new_password_again" className="text-left">Új jelszó újra</Label>
              <Input name="new_password_again" type="password" id="new_password_again" />
            </div>
          </div>
          <Button className="sm:hidden block w-max font-bold mx-4 ml-auto" type="submit">Mentés</Button>
        </form>
      </div>
    </div>
  )
}
