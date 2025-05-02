import { DatePicker } from '@/components/DatePicker'
import { LessonCardItem } from '@/components/LessonCardItem'
import { Separator } from '@/components/ui/separator'
import { getAllLessonsBetweenDates } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import React, { Fragment, useEffect, useState } from 'react'

export default function CalendarPage() {
  const auth = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [lessons, setLessons] = useState([])

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
    getAllLessonsBetweenDates(auth.token, getWeek(selectedDate).start, getWeek(selectedDate).end, "group,group.location,group.teachers,enroled.subject", "enroled").then(resp => setLessons(resp.data.lessons)).catch(err => setLessons([]))
  }, [selectedDate])
  
  return (
    <div className='flex items-center flex-col gap-2 m-4 w-full'>
      <div className='flex gap-2 w-full'>
        <DatePicker date={selectedDate} setDate={setSelectedDate} required />
      </div>
      { 
        days.map((day, i) => 
          <Fragment key={day + i}>
            <Separator />
            <p className='w-full text-left text-3xl'>{day}</p>
            <div className="flex flex-wrap w-full gap-2 py-2 mb-4 ml-8">
              {
                lessons.filter(l => new Date(l.start).getDay()-1 == i).length == 0 ?
                <p>Nincs Esemény</p>
                :
                lessons.filter(l => new Date(l.start).getDay()-1 == i).map(lesson => 
                  <LessonCardItem 
                    key={lesson.id}
                    lesson={lesson} />
                ) 
              }
            </div>
          </Fragment>
        )
      }
    </div>
  )
}
