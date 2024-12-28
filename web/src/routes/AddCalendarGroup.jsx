import { DatePicker } from '@/components/DatePicker'
import { GroupComboBox } from '@/components/GroupComboBox'
import { TimePicker } from '@/components/TimePicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getAllEmployees } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { Label } from '@radix-ui/react-dropdown-menu'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const AddCalendarGroup = () => {
  const auth = useAuth()

  const [employees, setEmployees] = useState([])
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [form, setForm] = useState({})
  
  useEffect(() => {
    getAllEmployees(auth.token).then(e => setEmployees(e.data.employees))
  }, [])

  return (
    <div className='relative flex justify-center'>
      <Link to={"/calendar"} className='absolute top-0 left-0'><Button variant="outline"><ArrowLeft /></Button></Link>
      <div className='max-w-screen-lg w-full flex flex-col justify-center gap-4'>
        <h2 className='text-center mb-4'>Csoport Hozzáadása</h2>
        <GroupComboBox data={employees} displayName={"name"} placeholder='Válassz Kurzust...' title={"Kurzusok"} className={"w-full"} />
        <GroupComboBox data={employees} displayName={"name"} placeholder='Válassz Tanulót...' title={"Tanulók"} className={"w-full"} />
        <GroupComboBox data={employees} displayName={"name"} placeholder='Válassz Oktatót...' title={"Oktatók"} className={"w-full"} />
        <Textarea placeholder="Megjegyzés..." />
        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <div className="flex flex-col gap-2">
              <p>Kezdés</p>
              <DatePicker date={startDate} setDate={setStartDate} />
            </div>
            <TimePicker date={startDate} setDate={setStartDate} label={"Időpont"} className={"px-5"} />
            <div className="flex flex-col gap-2">
              <Label>Össz. Óraszám</Label>
              <Input type="text" min={1} placeholder="Óraszám" value={form["lessonNum"]} onChange={(e) => /^\d*$/.test(e.target.value) && setForm({...form, lessonNum : +e.target.value < 1 ? "" : e.target.value})} />
            </div>
          </div>
          <div>
            <p>Befejezés</p>
            <DatePicker date={endDate} setDate={setEndDate} showTimePicker numberOfMonths={12} />
          </div>
        </div>
        <Button variant="outline" className="w-28 mx-auto">Hozzáadás</Button>
      </div>
    </div>
  )
}
