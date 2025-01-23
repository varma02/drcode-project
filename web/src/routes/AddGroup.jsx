import { Combobox } from '@/components/ComboBox'
import { DatePicker } from '@/components/DatePicker'
import { GroupComboBox } from '@/components/GroupComboBox'
import { TimePicker } from '@/components/TimePicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { createGroup, getAllEmployees, getAllLocations } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { Label } from '@radix-ui/react-dropdown-menu'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export default function AddCalendarGroup() {
  const auth = useAuth()

  const [employees, setEmployees] = useState([])
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date(new Date().setHours(new Date().getHours() + 1)))
  const [location, setLocation] = useState("")
  const [locations, setLocations] = useState([])
  
  useEffect(() => {
    getAllEmployees(auth.token).then(e => setEmployees(e.data.employees))
    getAllLocations(auth.token).then(data => setLocations(data.data.locations))
  }, [])

  function generateLessons(startDate, lessonCount, startTime, endTime) {
    const generated = []
    for (let index = 0; index < lessonCount; index++) {
      generated.push(
        {
          start: new Date(new Date(`${startDate}T${startTime}`).setDate(new Date(`${startDate}T${startTime}`).getDate() + index * 7)).toISOString(),
          end: new Date(new Date(`${startDate}T${endTime}`).setDate(new Date(`${startDate}T${endTime}`).getDate() + index * 7)).toISOString(),
        }
      )
    }
    console.log(generated)
    return generated
  }

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    console.log(formData)
    const lessons = generateLessons(formData.get("startDate"), formData.get("lessonNum"), formData.get("startTime"), formData.get("endTime"))
    createGroup(auth.token, formData.get("name"), formData.get("location"), formData.get("employees").split(","), formData.get("note"), lessons).then(
      () => { 
        toast.success("Csoport sikeresen létrehozva!")
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
      <h1 className='text-4xl mb-4'>Csoport Hozzáadása</h1>
      <div className='flex gap-4'>
        <Input type="text" placeholder="Név" name="name" />
        <Combobox data={locations} displayName={"name"} placeholder='Válassz helyszínt...' value={location} setValue={setLocation} className={"w-full"} name="location" />
      </div>
      <GroupComboBox data={employees} displayName={"name"} placeholder='Válassz oktatót...' title={"Oktatók"} className={"w-full"} name="employees" />
      <Textarea placeholder="Megjegyzés..." name="note" />

      <div className='flex gap-4'>
        <h4>Órák generálása</h4>
        <Switch />
      </div>
      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <div className="flex flex-col gap-2">
            <p>Első óra dátuma,</p>
            <DatePicker date={startDate} setDate={setStartDate} name="startDate" required />
          </div>
          <TimePicker date={startDate} setDate={setStartDate} name="startTime" label="Kezdete," className={"px-5"} />
          <p className='flex items-end pb-2'>-</p>
          <TimePicker date={endDate} setDate={setEndDate} name="endTime" label="Befejezése" className={"px-5"} />
          <div className="flex flex-col gap-2">
            <Label>Óraszám</Label>
            <Input type="number" min={1} name="lessonNum" placeholder="például: 12" />
          </div>
        </div>
      </div>
      <div className='flex gap-6 ml-auto'>
        <Link to="/groups">
          <Button variant="outline" className="w-28">Vissza</Button>
        </Link>
        <Button className="w-28 mx-auto" type="submit">Hozzáadás</Button>
      </div>
    </form>
  )
}
