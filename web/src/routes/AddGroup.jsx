import { Combobox } from '@/components/ComboBox'
import { DatePicker } from '@/components/DatePicker'
import { MultiSelect } from '@/components/MultiSelect'
import { TimePicker } from '@/components/TimePicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { create, getAll } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { convertToMultiSelectData, generateLessons } from '@/lib/utils'
import { Label } from '@radix-ui/react-dropdown-menu'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function AddCalendarGroup() {
  const auth = useAuth()
  const navigate = useNavigate()

  const [employees, setEmployees] = useState([])
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date(new Date().setHours(new Date().getHours() + 1)))
  const [location, setLocation] = useState("")
  const [locations, setLocations] = useState([])
  const [generateToggle, setGenerateToggle] = useState(false)
  
  useEffect(() => {
    getAll(auth.token, 'employee').then(e => setEmployees(e.data.employees))
    getAll(auth.token, 'location').then(data => setLocations(data.data.locations))
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const lessons = generateToggle ? generateLessons(formData.get("startDate"), formData.get("lessonNum"), formData.get("startTime"), formData.get("endTime")) : undefined
    const groupData = {
      name: formData.get("name"),
      location: formData.get("location"),
      teachers: formData.get("employees").split(","),
      lessons
    }
    create(auth.token, 'group', groupData).then(
      () => { 
        toast.success("Csoport sikeresen létrehozva!")
        navigate("/groups")
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
    <form className='flex flex-col max-w-screen-xl md:w-full mx-auto p-4 gap-6' onSubmit={handleSubmit} autoComplete='off'>
      <h1 className='text-4xl py-4'>Csoport Hozzáadása</h1>
      <div className='flex gap-4'>
        <Input type="text" placeholder="Név" name="name" />
        <Combobox data={locations} displayName={"name"} placeholder='Válassz helyszínt...' value={location} setValue={setLocation} className={"w-full"} name="location" />
      </div>
      <MultiSelect options={convertToMultiSelectData(employees)} name={"employees"} placeholder='Válassz oktatót...' />

      <div className='flex gap-4'>
        <h4>Órák generálása</h4>
        <Switch onCheckedChange={(e) => setGenerateToggle(e)} />
      </div>
      { generateToggle &&
      <>
        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <div className="flex flex-col gap-2">
              <p>Első óra dátuma</p>
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
      </>
      }
      <div className='flex gap-6 ml-auto'>
        <Link to="/groups">
          <Button variant="outline" className="w-28">Vissza</Button>
        </Link>
        <Button className="w-28 mx-auto" type="submit">Hozzáadás</Button>
      </div>
    </form>
  )
}
