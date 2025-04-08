import { DatePicker } from '@/components/DatePicker'
import { LessonCardItem } from '@/components/LessonCardItem'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getAllLessonsBetweenDates, getEmployee, getGroup, getLocation } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function CalendarPage() {
  const auth = useAuth()
  const [rows, setRows] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [lessons, setLessons] = useState([])
  const [teachers, setTeachers] = useState({})
  const [locations, setLocations] = useState({})
  const [groups, setGroups] = useState({})

  const days = "Hétfő Kedd Szerda Csütörtök Péntek Szombat Vasárnap".split(" ")

  const data = [
    // [{id:1, course: "Scratch", teacher: "Bypassed User"}],
    // [{id:2, course: "Web", teacher: "Bypassed User"}],
    // [{id:3, course: "WeDo 1.0", teacher: "Bypassed User"}, {id:31, course: "WeDo 2.0", teacher: "Bypassed User"}],
    // [],
    // [{id:5, course: "Unity", teacher: "Bypassed User"}],
    // [{id:6, course: "Scratch", teacher: "Bypassed User"}],
    // [],

    [],
    [],
    [],
    [],
    [],
    [],
    []
  ]

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
    // getAllLessonsBetweenDates(auth.token, { ...getWeek(date) }).then(resp => console.log(resp.data.lesons))
    getAllLessonsBetweenDates(auth.token, getWeek(selectedDate).start, getWeek(selectedDate).end).then(resp => setLessons(resp.data.lessons)).catch(err => setLessons([]))
  }, [selectedDate])

  // console.log("Groups: ", groups)
  // console.log("Techers: ", teachers)
  // console.log("Locations: ", locations)
  console.log("Lessons: ", lessons)

  useEffect(() => {
    setRows([])
    setGroups({})
    data.map((e, i) => data[i] = [])
    const gids = new Set()
    const eids = new Set()
    const lids = new Set()
    lessons.forEach(e => {
      gids.add(e.group)
      data[new Date(e.start).getDay()-1].push(e)
      setGroups(p => ({
        ...p,
        [e.group]: {}
      }))
    })
    console.log("Data: ", data)
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

      setRows([])
      for (let i = 0; i < Math.max(...data.map(e => e.length)); i++) {
        setRows(p => [...p,
          <TableRow key={i}>
            { 
              data.map((day, idx) => 
              (
                <TableCell key={"day"+idx} className="text-center w-[14.286%]">
                  {
                    day[i] ? 
                    // <LessonCardItem location={locations[groups[day[i].group].location]} teachers={day[i]} />
                    <LessonCardItem location={"Főhadiszállás"} time_start={format(new Date(day[i].start), "p").split(" ")[0]} time_end={format(new Date(day[i].end), "p").split(" ")[0]} />
                    // <div className='h-12 bg-red-500 rounded-lg flex justify-center items-center'>id</div>
                    : 
                    typeof day[i-1] == Object ? <p>+</p> : <hr className='w-full' />
                  }
                </TableCell>
              ))
            }
          </TableRow>
        ])
      }
    }))
  }, [lessons])

  // console.log(lessons.length > 0 && days[new Date(lessons[3].start).getDay()-1])
  // console.log(getWeek(date))
  
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
      {/* <Table>
        <TableHeader>
          <TableRow>
            {days.map(e => <TableHead key={e} className="text-center">{e}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          { rows }
        </TableBody>
      </Table> */}
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
