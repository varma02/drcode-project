import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { create } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import React from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export default function AddStudent() {
  const auth = useAuth()

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const parent = { name: formData.get("parentName") || undefined, email: formData.get("parentEmail") || undefined, phone: formData.get("parentPhone") || undefined }
    console.log(formData)
    console.log(!Object.values(parent).every(e => e == undefined));
    
    //console.log(formData.get("email") || undefined);
    create(auth.token, 'student',
      formData.get("name"),
      +formData.get("grade"),
      formData.get("email") || undefined,
      formData.get("phone") || undefined,
      !Object.values(parent).every(e => e == undefined) ? parent : undefined
    ).then(
      () => {
        toast.success("Tanuló sikeresen létrehozva!")
      },
      (error) => {
        console.error(error)
        switch (error.response?.data?.code) {
          case "fields_required":
            return toast.error("Valamelyik mező üres!")
          case "unauthorized":
            return toast.error("Ehhez hincs jogosultsága!")
          default:
            return toast.error("Ismeretlen hiba történt!")
        }
      }
    )
  }

  return (
    <form className='flex flex-col max-w-screen-xl md:w-full mx-auto p-4 gap-6' onSubmit={handleSubmit}>
      <h1 className='text-4xl py-4'>Tanuló Hozzáadása</h1>
      <div className='flex gap-4'>
        <Input type="text" placeholder="Név" name="name" />
        <Input type="number" placeholder="Osztály" name="grade" />
      </div>
      <div className='flex gap-4'>
        <Input type="text" placeholder="Email" name="email" />
        <Input type="text" placeholder="Telefonszám" name="phone" />
      </div>
      <h3 className='text-2xl py-4'>Szülő adatai</h3>
      <div className='flex gap-4'>
        <Input type="text" placeholder="Szülő neve" name="parentName" />
        <Input type="text" placeholder="Szülő email" name="parentEmail" />
        <Input type="text" placeholder="Szülő telefonszáma" name="parentPhone" />
      </div>

      <div className='flex gap-6 ml-auto'>
        <Link to="/students">
          <Button variant="outline" className="w-28">Vissza</Button>
        </Link>
        <Button className="w-28 mx-auto" type="submit">Hozzáadás</Button>
      </div>
    </form>
  )
}