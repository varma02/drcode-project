import { Combobox } from '@/components/ComboBox'
import { MultiSelect } from '@/components/MultiSelect'
import { TimePicker } from '@/components/TimePicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createLesson, createSubject, getAllEmployees, getAllGroups, getAllLocations } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export default function AddNewSubject() {
  const auth = useAuth()
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [teachers, setTeachers] = useState([])
  const [selectedTeachers, setSelectedTeachers] = useState([])
  const [locations, setLocations] = useState([])
  const [groups, setGroups] = useState([])

  useEffect(() => {
    getAllEmployees(auth.token).then(resp => setTeachers(resp.data.employees))
    getAllLocations(auth.token).then(resp => setLocations(resp.data.locations))
    getAllGroups(auth.token).then(resp => setGroups(resp.data.groups))
  }, [auth.token])

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    console.log(formData)
    // createLesson(auth.token, formData.get("name"), formData.get("note")).then(
    //   () => { 
    //     toast.success("Óra sikeresen létrehozva!")
    //   },
    //   (error) => { 
    //     console.error(error)
    //     switch (error.response?.data?.code) {
    //       case "fields_required":
    //         return toast.error("Valamelyik mező üres!")
    //       case "unauthorized":
    //         return toast.error("Ehhez hincs jogosultsága!")
    //       default:
    //         return toast.error("Ismeretlen hiba történt!")
    //     }
    //   }
    // )
  }

  console.log(teachers)

  return (
    <form className='flex flex-col max-w-screen-xl md:w-full mx-auto p-4 gap-6' onSubmit={handleSubmit}>
      <h1 className='text-4xl py-4'>Óra Hozzáadása</h1>
      <div className='flex gap-4 items-end'>
        <Input type="text" placeholder="Név" name="name" />
        <div className='flex gap-4 items-end'>
          <TimePicker name={"start"} />
          <p className='mb-2'>-</p>
          <TimePicker name={"end"} />
        </div>
      </div>

      <div className='flex gap-4'>
        <MultiSelect options={[...teachers.map(e => ({label:e.name, value:e}) )]} name={"teachers"} placeholder='Válassz oktatót...' className="w-fit" />
        <Combobox data={groups} displayName={"name"} name={"group"} placeholder='Válassz csoportot...' />
        <Combobox data={locations} displayName={"address"} name={"location"} placeholder='Válassz helyszínt...' />
      </div>


      <div className='flex gap-6 ml-auto'>
        <Link to="/subjects">
          <Button variant="outline" className="w-28">Vissza</Button>
        </Link>
        <Button className="w-28 mx-auto" type="submit">Hozzáadás</Button>
      </div>
    </form>
  )
}
