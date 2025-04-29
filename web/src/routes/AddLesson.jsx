import { Combobox } from '@/components/ComboBox'
import { DatePicker } from '@/components/DatePicker'
import { MultiSelect } from '@/components/MultiSelect'
import { TimePicker } from '@/components/TimePicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { create, getAll } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { convertToMultiSelectData, generateLessons } from '@/lib/utils'
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
    getAll(auth.token, 'employee').then(resp => setTeachers(resp.data.employees))
    getAll(auth.token, 'location').then(resp => setLocations(resp.data.locations))
    getAll(auth.token, 'group').then(resp => setGroups(resp.data.groups))
  }, [auth.token])

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    console.log(formData)
    const lessonTime = generateLessons(formData.get("lessonDate"), 1, formData.get("start"), formData.get("end"))[0]
    const lessondata = {
      name: formData.get("name"),
      group: formData.get("group"),
      location: formData.get("location"),
      teachers: [
        "employee:abc123"
      ],
      ...lessonTime
    }
    console.log(lessondata)
    create(auth.token, 'lesson', lessondata).then(
      () => { 
        toast.success("Óra sikeresen létrehozva!")
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
      <h1 className='text-4xl py-4'>Óra Hozzáadása</h1>
      <div className='flex gap-4 items-end'>
        <Input type="text" placeholder="Név" name="name" />
        <div className='flex gap-4 items-end'>
          <DatePicker name={"lessonDate"} />
          <TimePicker name={"start"} />
          <p className='mb-2'>-</p>
          <TimePicker name={"end"} />
        </div>
      </div>

      <div className='flex gap-4'>
        <MultiSelect options={convertToMultiSelectData(teachers, "name")} name={"teachers"} placeholder='Válassz oktatót...' className="w-fit" />
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
