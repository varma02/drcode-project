import { DatePicker } from '@/components/DatePicker'
import { LessonCardItem } from '@/components/LessonCardItem'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { getAllLessonsBetweenDates } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'

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

  function navigateWeek(direction) {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + (direction * 7))
    setSelectedDate(newDate)
  }

  useEffect(() => {
    getAllLessonsBetweenDates(auth.token, getWeek(selectedDate).start, getWeek(selectedDate).end, "group,group.location,group.teachers,enroled.subject", "enroled")
      .then(resp => setLessons(resp.data.lessons))
      .catch(err => setLessons([]))
  }, [selectedDate])
  
  return (
    <div 
      initial="hidden"
      animate="visible"
      className="max-w-screen-xl mx-auto px-4 py-8 space-y-6"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent rounded-lg blur-lg -z-10" />
          <h1 className='text-4xl py-4'>Naptár</h1>
      </div>

      <div className="flex justify-between gap-4 mb-8 flex-col lg:flex-row">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Kiválasztott hét</p>
            <p className="text-lg font-semibold">
              {format(getWeek(selectedDate).start, 'yyyy. MMMM d.', { locale: hu })} - {format(getWeek(selectedDate).end, 'MMMM d.', { locale: hu })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateWeek(-1)} className="rounded-xl hover:bg-primary/5">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <DatePicker date={selectedDate} setDate={setSelectedDate} />
          <Button variant="outline" size="icon" onClick={() => navigateWeek(1)} className="rounded-xl hover:bg-primary/5">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {days.map((day, i) => (
          <div 
            key={day + i}
            className="relative"
          >
            <Card className="glass-effect border-white/10 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{day}</h3>
                </div>
                <Separator className="my-4 opacity-50" />
                <div className="flex flex-wrap gap-4 py-2">
                  {lessons.filter(l => new Date(l.start).getDay()-1 === i).length === 0 ? (
                    <p className="text-muted-foreground/60 italic">Nincs esemény ezen a napon</p>
                  ) : (
                    <div className="flex gap-4 w-full flex-wrap">
                      {lessons
                        .filter(l => new Date(l.start).getDay()-1 === i)
                        .map(lesson => (
                          <LessonCardItem 
                            key={lesson.id}
                            lesson={lesson}
                          />
                        ))
                      }
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
