import { create, getAll, getAllLessonsBetweenDates } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { Combobox } from './ComboBox'
import { DatePicker } from './DatePicker'
import { toast } from 'sonner'
import { Input } from './ui/input'

export default function ReplacementDialog({students, originalLessonId}) {
  const auth = useAuth()
  const [allStudents, setAllStudents] = useState(students)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [lessons, setLessons] = useState([])
  
  console.log(lessons)
  
  useEffect(() => {
    setLessons([])
    const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0)
    const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59)
    getAllLessonsBetweenDates(auth.token, startOfDay, endOfDay, "group").then(resp => setLessons(resp.data.lessons))
  }, [selectedDate])

  function handleAddReplacement(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    console.log(formData)
    create(auth.token, "replacement", {
      student: formData.get("student"),
      original_lesson: originalLessonId,
      replacement_lesson: formData.get("lesson"),
      extension: formData.get("extension") + "m",
    }).then(resp => {
      switch (resp.code) {
        case "success":
          return toast.success("Pótlás sikeresen hozzáadva!")
        case "bad_request":
          return toast.success("Valamelyik mező üres!")
        default:
          return toast.error("Ismeretlen hiba történt!")
      }
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">Pótlás <Plus /></Button></DialogTrigger>
      <DialogContent>
        <DialogTitle>Pótlás hozzáadása</DialogTitle>
        <form onSubmit={handleAddReplacement} className='flex flex-col gap-4'>
          <Combobox data={allStudents || []} displayName={"name"} name={"student"} placeholder='Válassz tanulót...'
            onOpenChange={e => e && !allStudents &&
              getAll(auth.token, "student").then(resp => setAllStudents(resp.data.students))
            } 
            />
          <DatePicker date={selectedDate} setDate={setSelectedDate} name={"date"} dateFormat='PPPP' />
          <Combobox data={lessons} displayName={"group.name"} name={"lesson"} placeholder='Válassz órát...'
            onOpenChange={e => e && !allStudents &&
              getAll(auth.token, "student").then(resp => setAllStudents(resp.data.students))
            } 
            />
          <p className='text-sm -mb-6 z-10 ml-3'>Hosszabbítás (perc)</p>
          <Input name={"extension"} className="w-1/3" defaultValue="30" />
          <DialogClose asChild className='w-max ml-auto'><Button type="submit">Hozzáadás</Button></DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  )
}
