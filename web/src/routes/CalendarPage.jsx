import { DatePicker } from '@/components/DatePicker'
import { LessonCardItem } from '@/components/LessonCardItem'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { getAllLessonsBetweenDates, getEmployee, getGroup, getLocation } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function CalendarPage() {
  const auth = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [lessons, setLessons] = useState([])
  const [teachers, setTeachers] = useState({})
  const [locations, setLocations] = useState({})
  const [groups, setGroups] = useState({})

  const days = "Hétfő Kedd Szerda Csütörtök Péntek Szombat Vasárnap".split(" ")

  function getWeek(date) {
    const diffToMonday = (date.getDay() === 0 ? -6 : 1) - date.getDay()
    const monday = new Date(date.setHours(0, 0))
    monday.setDate(date.getDate() + diffToMonday)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    return {
      start: monday,
      end: sunday
    }
  }

  useEffect(() => {
    getAllLessonsBetweenDates(auth.token, getWeek(selectedDate).start, getWeek(selectedDate).end).then(resp => setLessons(resp.data.lessons)).catch(err => setLessons([]))
  }, [selectedDate])

  useEffect(() => {
    setGroups({})
    const gids = new Set()
    const eids = new Set()
    const lids = new Set()
    lessons.forEach(e => {
      gids.add(e.group)
    })
    if (gids.size == 0) return
    getGroup(auth.token, Array.from(gids).join(",")).then(resp => resp.data.groups.map(e => {
      setGroups(p => ({
        ...p,
        [e.id]: {
          ...p[e.id],
          name: e.name,
          teachers: e.teachers,
          location: e.location
        }
      }))

      eids.add(...e.teachers)
      lids.add(e.location)

      getEmployee(auth.token, Array.from(eids).join(",")).then(resp => resp.data.employees.map(e => {
        setTeachers(p => ({
          ...p,
          [e.id]: e.name
        }))
      }))

      getLocation(auth.token, Array.from(lids).join(",")).then(resp => resp.data.locations.map(e => {
        setLocations(p => ({
          ...p,
          [e.id]: e.address
        }))
      }))
    }))
  }, [lessons])
  
  return (
    <div className='flex items-center flex-col gap-2 m-4 w-full'>
      <div className='flex gap-2 w-full'>
        <DatePicker date={selectedDate} setDate={setSelectedDate} required />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline"><Plus /></Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col w-max p-2">
            <Link to={"/calendar/add/group"}><Button variant="ghost" className="w-full">Csoport Hozzáadása</Button></Link>
            <Link to={"/calendar/add/event"}><Button variant="ghost" className="w-full">Esemény Hozzáadása</Button></Link>
          </PopoverContent>
        </Popover>
      </div>
      { 
        days.map((day, i) => 
          <>
            <Separator />
            <p className='w-full text-left text-3xl'>{day}</p>
            <div className="flex flex-wrap w-full gap-2 py-2 mb-4 ml-8">
              {
                lessons.filter(l => new Date(l.start).getDay()-1 == i).length == 0 ?
                <p>Nincs Esemény</p>
                :
                lessons.filter(l => new Date(l.start).getDay()-1 == i).map(j => 
                  <>
                    <LessonCardItem location={"Főhadiszállás"} time_start={format(new Date(j.start), "p").split(" ")[0]} time_end={format(new Date(j.end), "p").split(" ")[0]} />
                  </>
                ) 
              }
            </div>
          </>
        )
      }
    </div>
  )
}
