import { LessonCardItem } from '@/components/LessonCardItem'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { BookOpen, CalendarIcon, Clock, MapPin, User2 } from 'lucide-react'
import React, { useState } from 'react'

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

  for (let i = 0; i < Math.max(...data.map(e => e.length)); i++) {
    rows.push(
      <TableRow key={i}>
        { 
          data.map((day, idx) => 
          (
            <TableCell key={"day"+idx} className="text-center w-[14.285%]">
              {
                day[i] ? <LessonCardItem course={day[i].course} teacher={day[i].teacher} /> : <hr />
              }
            </TableCell>)
          )
        }
      </TableRow>
    )
  }
  
  const [date, setDate] = useState(new Date())
  
  return (
    <div className='flex items-center flex-col'>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
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
