import { DatePicker } from '@/components/DatePicker'
import { LessonCardItem } from '@/components/LessonCardItem'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { BookOpen, CalendarIcon, Clock, MapPin, Plus, User2 } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export const CalendarPage = () => {

  const days = "Hétfő Kedd Szerda Csütörtök Péntek Szombat Vasárnap".split(" ")

  const data = [
    [{id:1, course: "Scratch", teacher: "Bypassed User"}],
    [{id:2, course: "Web", teacher: "Bypassed User"}],
    [{id:3, course: "WeDo 1.0", teacher: "Bypassed User"}, {id:31, course: "WeDo 2.0", teacher: "Bypassed User"}],
    [],
    [{id:5, course: "Unity", teacher: "Bypassed User"}],
    [{id:6, course: "Scratch", teacher: "Bypassed User"}],
    [],
  ]

  const rows = []

  for (let i = 0; i < Math.max(...data.map(e => e.length))+1; i++) {
    rows.push(
      <TableRow key={i}>
        { 
          data.map((day, idx) => 
          (
            <TableCell key={"day"+idx} className="text-center w-[14.285%]">
              {
                day[i] ? 
                <LessonCardItem course={day[i].course} teacher={day[i].teacher} /> 
                : 
                typeof day[i-1] == Object ? <p>+</p> : <hr />
              }
            </TableCell>)
          )
        }
      </TableRow>
    )
  }
  
  const [date, setDate] = useState(new Date())
  
  return (
    <div className='flex items-center flex-col gap-2'>
      <div className='flex gap-2'>
        <DatePicker date={date} setDate={setDate} />
        <Popover>
          <PopoverTrigger>
            <Button variant="outline"><Plus /></Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col w-max p-2">
            <Link to={"/calendar/add/group"}><Button variant="ghost" className="w-full">Csoport Hozzáadása</Button></Link>
            <Link to={"/calendar/add/event"}><Button variant="ghost" className="w-full">Esemény Hozzáadása</Button></Link>
          </PopoverContent>
        </Popover>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {days.map(e => <TableHead key={e} className="text-center">{e}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          { rows }
        </TableBody>
      </Table>
    </div>
  )
}
