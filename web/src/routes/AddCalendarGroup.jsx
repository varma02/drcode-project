import { Combobox } from '@/components/ComboBox'
import { DatePicker } from '@/components/DatePicker'
import { GroupComboBox } from '@/components/GroupComboBox'
import { TimePicker } from '@/components/TimePicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createGroup, getAllEmployees, getAllLocations } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { Label } from '@radix-ui/react-dropdown-menu'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export const AddCalendarGroup = () => {
  const auth = useAuth()

  const [employees, setEmployees] = useState([])
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [location, setLocation] = useState("")
  const [locations, setLocations] = useState([])
  
  useEffect(() => {
    getAllEmployees(auth.token).then(e => setEmployees(e.data.employees))
    getAllLocations(auth.token).then(data => setLocations(data.data.locations))
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const lessons = []
    const name = "name"
    createGroup(auth.token, name, formData.get("location"), formData.get("employees").split(","), formData.get("note"), lessons).then(
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
    <form className='relative flex justify-center' onSubmit={handleSubmit}>
      <Link to={"/calendar"} className='absolute top-0 left-0'><Button variant="outline"><ArrowLeft /></Button></Link>
      <div className='max-w-screen-lg w-full flex flex-col justify-center gap-4'>
        <h2 className='text-center mb-4'>Csoport Hozzáadása</h2>
        <Combobox data={locations} displayName={"name"} placeholder='Válassz Lokációt...' value={location} setValue={setLocation} className={"w-full"} name="location" />
        <GroupComboBox data={employees} displayName={"name"} placeholder='Válassz Oktatót...' title={"Oktatók"} className={"w-full"} name="employees" />
        <Textarea placeholder="Megjegyzés..." name="note" />
        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <div className="flex flex-col gap-2">
              <p>Kezdés</p>
              <DatePicker date={startDate} setDate={setStartDate} name="startDate" />
            </div>
            <TimePicker date={startDate} setDate={setStartDate} name="startTime" label={"Kezdés"} className={"px-5"} />
            <p className='flex items-end pb-2'>-</p>
            <TimePicker date={endDate} setDate={setEndDate} name="endTime" label={"Befejezés"} className={"px-5"} />
            <div className="flex flex-col gap-2">
              <Label>Össz. Óraszám</Label>
              <Input type="text" min={1} name="lessonNum" placeholder="Óraszám" />
            </div>
          </div>
        </div>
        <Button variant="outline" className="w-28 mx-auto" type="submit">Hozzáadás</Button>
      </div>
    </form>
  )
}
