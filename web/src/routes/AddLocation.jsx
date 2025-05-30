import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { create } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function AddNewLocation() {
  const auth = useAuth()
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    create(auth.token, 'location', {name: formData.get("name"), address: formData.get("address"), contact_email: formData.get("contact_email"), contact_phone: formData.get("contact_phone")}).then(
      () => { 
        navigate("/locations")
        toast.success("Helyszín sikeresen létrehozva!")
      },
      (error) => { 
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
      <h1 className='text-4xl py-4'>Helyszín Hozzáadása</h1>
      <div className='flex gap-4'>
        <Input type="text" placeholder="Név" name="name" />
        <Input type="text" placeholder="Cím" name="address" />
      </div>
      <div className='flex gap-4'>
        <Input type="text" placeholder="Email" name="contact_email" />
        <Input type="text" placeholder="Telefon" name="contact_phone" />
      </div>

      <div className='flex gap-6 ml-auto'>
        <Link to="/locations">
          <Button variant="outline" className="w-28">Vissza</Button>
        </Link>
        <Button className="w-28 mx-auto" type="submit">Hozzáadás</Button>
      </div>
    </form>
  )
}
