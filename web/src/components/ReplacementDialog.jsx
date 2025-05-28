import { create, getAll, getAllLessonsBetweenDates } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { CircleHelp, Plus } from 'lucide-react'
import { Combobox } from './ComboBox'
import { DatePicker } from './DatePicker'
import { toast } from 'sonner'
import { Input } from './ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

export default function ReplacementDialog({students, originalLessonId, setNewStudents}) {
  const auth = useAuth()
  const [allStudents, setAllStudents] = useState(students)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [lessons, setLessons] = useState([])
  
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
      original_lesson: formData.get("lesson"),
      replacement_lesson: originalLessonId,
      extension: formData.get("extension") + "m",
    }).then(resp => {
      setNewStudents && setNewStudents(p => [...p, {...allStudents.find(v => v.id == formData.get("student")), replacement: true}])
      return toast.success("Pótlás sikeresen hozzáadva!"), 
      (error) => {
      switch (error.response?.data?.code) {
        case "bad_request":
          return toast.error("Valamelyik mező üres!")
        default:
          return toast.error("Ismeretlen hiba történt!")
      }}}
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">Pótlás <Plus /></Button></DialogTrigger>
      <DialogContent>
        <DialogTitle>Pótlás hozzáadása</DialogTitle>
        <form onSubmit={handleAddReplacement} className='flex flex-col gap-4'>
          <h4>Tanuló *</h4>
          <Combobox data={allStudents || []} displayName={"name"} name={"student"} placeholder='Válassz tanulót...'
            onOpenChange={e => e && !allStudents &&
              getAll(auth.token, "student").then(resp => setAllStudents(resp.data.students))
            } 
            />
          <h4>Nap * <TooltipProvider>
            <Tooltip>
              <TooltipTrigger><CircleHelp size={16} /></TooltipTrigger>
              <TooltipContent>
                <p>Melyik napot pótolja</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider></h4>
          <DatePicker date={selectedDate} setDate={setSelectedDate} name={"date"} dateFormat='PPPP' />
          <h4>Csoport *</h4>
          <Combobox data={lessons} displayName={"group.name"} name={"lesson"} placeholder='Válassz órát...'
            onOpenChange={e => e && !allStudents &&
              getAll(auth.token, "student").then(resp => setAllStudents(resp.data.students))
            } 
            />
          {/* <p className='text-sm -mb-6 z-10 ml-3'>Hosszabbítás (perc)</p> */}
          <h4>Hosszabbítás (perc) *</h4>
          <Input name={"extension"} className="w-1/3" defaultValue="30" />
          <DialogClose asChild className='w-max ml-auto'><Button type="submit">Hozzáadás</Button></DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  )
}
