import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { create } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import React from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export default function AddNewSubject() {
  const auth = useAuth()

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    create(auth.token, 'subject', { name: formData.get("name"), description: formData.get("description") }).then(
      () => { 
        toast.success("Kurzus sikeresen létrehozva!")
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
      <h1 className='text-4xl py-4'>Kurzus Hozzáadása</h1>
      <div className='flex gap-4'>
        <Input type="text" placeholder="Név" name="name" />
      </div>
      <Textarea placeholder="Leírás..." name="description" />

      <div className='flex gap-6 ml-auto'>
        <Link to="/subjects">
          <Button variant="outline" className="w-28">Vissza</Button>
        </Link>
        <Button className="w-28 mx-auto" type="submit">Hozzáadás</Button>
      </div>
    </form>
  )
}
