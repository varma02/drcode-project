import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { update } from '@/lib/api/api';
import { useAuth } from '@/lib/api/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pen, Save, Shield, User, Mail, Lock } from 'lucide-react';
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
    <div className='flex flex-col items-center w-full p-4 pt-10 bg-gradient-to-b from-zinc-900 to-zinc-950 min-h-[calc(100vh-64px)]'>
      <Card className='max-w-[800px] w-full bg-[#18181b] rounded-xl border-0 shadow-xl overflow-hidden'>
        <CardHeader className='p-0'>
          <div className={`${auth.user.roles?.includes("administrator") ? "bg-gradient-to-r from-red-600 to-red-500" : "bg-gradient-to-r from-emerald-600 to-emerald-500"} px-6 py-4 relative h-16 flex items-center`}>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              {auth.user.roles?.includes("administrator") ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
              Profil beállításai
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <form id="settings-form" className='text-right flex gap-6 p-6 flex-col sm:flex-row' onSubmit={handleSubmit}>
            <div className='sm:min-w-48 relative flex flex-col items-center'>
              <div className="relative mb-8">
                <Avatar className="w-48 h-48 border-4 border-[#18181b] -mt-12 shadow-lg bg-zinc-800">
                  <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" className="object-cover" />
                  <AvatarFallback className="text-5xl font-bold bg-zinc-800">{auth.user.name?.split(" ").slice(0, 2).map(v => v[0]).join("")}</AvatarFallback>
                </Avatar>
                <input type="file" className='absolute w-48 h-48 rounded-full opacity-0 peer cursor-pointer -top-12 left-0' />
                <div className='pointer-events-none absolute w-48 h-48 flex justify-center items-center peer-hover:bg-black/40 opacity-0 peer-hover:opacity-100 rounded-full transition-all duration-300 -top-12'>
                  <div className="bg-black/60 p-3 rounded-full">
                    <Pen className="h-6 w-6" />
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">{auth.user.name}</h3>
                <p className="text-sm text-zinc-400">{auth.user.roles?.includes("administrator") ? "Adminisztrátor" : "Felhasználó"}</p>
              </div>
              
              <Button className="hidden sm:flex items-center gap-2 w-full font-bold bg-emerald-600 hover:bg-emerald-700 transition-colors" type="submit">
                <Save className="h-4 w-4" /> Mentés
              </Button>
            </div>
            
            <div className='w-full flex flex-col gap-6 divide-y divide-zinc-800'>
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2 text-zinc-200">
                  <User className="h-4 w-4 text-zinc-400" /> Személyes adatok
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-left flex items-center gap-1.5">
                      <User className="h-4 w-4 text-zinc-400" /> Teljes név *
                    </Label>
                    <Input 
                      name="name" 
                      type="text" 
                      id="name" 
                      placeholder="Minta Péter" 
                      required 
                      defaultValue={auth.user.name} 
                      className="bg-zinc-900 border-zinc-800 focus:border-emerald-500 focus-visible:ring-emerald-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-left flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-zinc-400" /> E-mail cím *
                    </Label>
                    <Input 
                      name="email" 
                      type="email" 
                      id="email" 
                      placeholder="minta.peter@example.com" 
                      required 
                      defaultValue={auth.user.email}
                      className="bg-zinc-900 border-zinc-800 focus:border-emerald-500 focus-visible:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-6 space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2 text-zinc-200">
                  <Lock className="h-4 w-4 text-zinc-400" /> Jelszókezelés
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="old_password" className="text-left flex items-center gap-1.5">
                      <Lock className="h-4 w-4 text-zinc-400" /> Jelenlegi jelszó *
                    </Label>
                    <Input 
                      name="old_password" 
                      required 
                      type="password" 
                      id="old_password"
                      className="bg-zinc-900 border-zinc-800 focus:border-emerald-500 focus-visible:ring-emerald-500/20"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new_password" className="text-left flex items-center gap-1.5">
                        <Lock className="h-4 w-4 text-zinc-400" /> Új jelszó
                      </Label>
                      <Input 
                        name="new_password" 
                        type="password" 
                        id="new_password"
                        className="bg-zinc-900 border-zinc-800 focus:border-emerald-500 focus-visible:ring-emerald-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_password_again" className="text-left flex items-center gap-1.5">
                        <Lock className="h-4 w-4 text-zinc-400" /> Új jelszó újra
                      </Label>
                      <Input 
                        name="new_password_again" 
                        type="password" 
                        id="new_password_again"
                        className="bg-zinc-900 border-zinc-800 focus:border-emerald-500 focus-visible:ring-emerald-500/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          
          <div className="px-6 pb-6 pt-2 flex justify-end">
            <Button className="sm:hidden flex items-center gap-2 font-bold bg-emerald-600 hover:bg-emerald-700 transition-colors" type="submit" form="settings-form">
              <Save className="h-4 w-4" /> Mentés
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
