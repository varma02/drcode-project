import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button';
import { getAllEmployees } from '@/lib/api/api';
import { useAuth } from '@/lib/api/AuthProvider';
import { Pen } from 'lucide-react'
import React, { useState } from 'react'

export const Settings = () => {
  const auth = useAuth()

  const [formData, setFormData] = useState({
    name: auth.user.name || '',
    password: auth.user.password || '',
    email: auth.user.email || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form Submitted:', formData)
  }

  console.log(auth.token);
  // console.log(getAllEmployees());
  

  return (
    <div className='flex flex-col items-center'>
      <h2 className='text-xl font-bold mb-4'>Beállíások</h2>
      <div className='max-w-[600px] w-[600px] bg-[#18181b] rounded-xl'>
        <div className={`${auth.user.roles.includes("administrator") ? "bg-red-500" : "bg-green-500"} px-4 py-2 rounded-t-xl relative h-20`}></div>
        <form className='text-right min-h-20 flex gap-2 px-4 mb-4' onSubmit={handleSubmit}>
          <div className='min-w-36 min-h-36 relative'>
            <Avatar className="min-w-36 min-h-36 absolute border-4 border-[#18181b] -top-10">
              <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
              <AvatarFallback className="text-4xl font-bold">{auth.user.name.split(" ").slice(0, 2).map(v => v[0]).join("")}</AvatarFallback>
            </Avatar>
            <input type="file" className='absolute w-36 h-36 bg-red-500 rounded-full opacity-0 peer cursor-pointer -top-10 left-0' />
            <div className='pointer-events-none absolute min-w-36 min-h-36 flex justify-center items-center peer-hover:bg-black/30 opacity-0 peer-hover:opacity-100 rounded-full transition-all duration-300 -top-10'><Pen /></div>
            <Button className="absolute bottom-0 left-0 w-full font-bold" type="submit">Mentés</Button>
          </div>
          <div className='w-full flex flex-col'>
            <div className='p-3 flex justify-between items-center relative'>
              <div className='flex flex-col w-full absolute'>
                <label className='opacity-50 text-sm text-left'>Felhasználónév</label>
                <input name='name' type="text" value={formData.name} onChange={handleChange} className='bg-transparent outline-none w-full absolute pt-4' />
              </div>
              <Pen className='ml-auto mt-6' />
            </div>
            <div className='p-3 flex justify-between items-center relative'>
              <div className='flex flex-col w-full absolute'>
                <label className='opacity-50 text-sm text-left'>Jelszó</label>
                <input name='password' type="password" value={formData.password} onChange={handleChange} className='bg-transparent outline-none w-full absolute pt-4' />
              </div>
              <Pen className='ml-auto mt-6' />
            </div>
            <div className='p-3 flex justify-between items-center relative'>
              <div className='flex flex-col w-full absolute'>
                <label className='opacity-50 text-sm text-left'>Email</label>
                <input name='email' type="email" value={formData.email} onChange={handleChange} className='bg-transparent outline-none w-full absolute pt-4' />
              </div>
              <Pen className='ml-auto mt-6' />
            </div>
          </div>
        </form>
      </div>
      {/* <div className='w-96'>
        <div className='bg-[#2a2a30] rounded-xl divide-y divide-black'>
        <div className='p-3 flex justify-between items-center'>
            <div className='flex flex-col'>
              <label className='opacity-50 text-sm'>Felhasználónév</label>
              <input type="text" value={"Username"} className='bg-transparent' />
            </div>
            <Pen />
          </div>
          <div className='p-3 flex justify-between items-center'>
            <div className='flex flex-col'>
              <label className='opacity-50 text-sm'>Jelszó</label>
              <input type="password" value={"12345678"} className='bg-transparent' />
            </div>
            <Pen />
          </div>
          <div className='p-3 flex justify-between items-center'>
            <p>Profilkép</p>
            <input type="file" className='bg-transparent w-20 rounded-lg' />
          </div>
        </div>
      </div> */}
    </div>
  )
}
