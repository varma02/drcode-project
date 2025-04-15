import { AssignmentMessage, NotificationMessage } from '@/components/Messages'
import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Folder, ArrowUpDown, Clock, MapPin, User2, ArrowUp, ArrowDown, Play } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ToggleButton } from '@/components/ToggleButton'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/api/AuthProvider'
import { getAllLessonsBetweenDates, getAllSubjects, getGroupWithDetails, getLocation, getStudentWithDetails } from '@/lib/api/api'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import WorkInProgress from '@/components/WorkInProgress'

export default function Home() {
  const auth = useAuth()
  const [allSubjects, setAllSubjects] = useState([])
  const [nextLesson, setNextLesson] = useState(null)
  const [nextLessonGroup, setNextLessonGroup] = useState(null)
  const [nextLessonLocation, setNextLessonLocation] = useState(null)
  const [nextLessonStudents, setNextLessonStudents] = useState([])

  useEffect(() => {
    getAllSubjects(auth.token).then(resp => setAllSubjects(resp.data.subjects))
    const today = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(today.getDate() + 7)
    getAllLessonsBetweenDates(auth.token, today, nextWeek).then(resp => setNextLesson(resp.data.lessons[0]))
  }, [auth.token])

  useEffect(() => {
    if (!nextLesson) return
    getGroupWithDetails(auth.token, nextLesson.group).then(resp => setNextLessonGroup(resp.data.groups[0]))
  }, [nextLesson])

  useEffect(() => {
    if (!nextLessonGroup) return
    getStudentWithDetails(auth.token, [...nextLessonGroup.enroled.map(e => e.in)]).then(resp => setNextLessonStudents(resp.data.students))
    getLocation(auth.token, nextLessonGroup.location).then(resp => setNextLessonLocation(resp.data.locations[0]))
  }, [nextLessonGroup])
  
  const columns = [
    {
      displayName: "Név",
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {column.columnDef.displayName}
            {!column.getIsSorted() ? <ArrowUpDown /> 
            : column.getIsSorted() === "asc" ? <ArrowDown /> : <ArrowUp />}
          </Button>
        )
      },
    },
    {
      accessorKey: "grade",
      displayName: "Évfolyam",
      header: ({ column }) => column.columnDef.displayName,
    },
    {
      accessorKey: "parent.name",
      displayName: "Szülő neve",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {column.columnDef.displayName}
            {!column.getIsSorted() ? <ArrowUpDown /> 
            : column.getIsSorted() === "asc" ? <ArrowDown /> : <ArrowUp />}
          </Button>
        )
      },
    },
    {
      displayName: "Létrehozva",
      accessorKey: "created",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => format(new Date(row.getValue("created")), "P", {locale: hu}),
    },
    {
      displayName: "Jelenlét",
      accessorKey: "status",
      header: "Jelenlét",
      cell: ({ row }) => (
        <ToggleButton onText={"Jelen"} offText={"Hiányzik"} />
      ),
    },
  ]

  return (
    <div className='flex flex-col md:grid grid-cols-2 grid-rows-3 gap-4 p-4 md:h-screen w-full'>
      <div className='bg-primary-foreground rounded-xl p-4 row-span-3 h-full flex flex-col overflow-auto'>
        <h2 className='md:text-left text-center mb-4'>Következő óra</h2>
        <Card className="w-full flex xl:flex-row flex-col mb-4">
          { nextLesson ?
          <>
          <div className='p-4 pr-0 md:self-auto self-center md:w-32 w-20'>
            <img src="https://seeklogo.com/images/S/scratch-cat-logo-7F652C6253-seeklogo.com.png" className='object-cover object-center rounded-md' />
          </div>
          <div className='flex flex-col'>
            <CardHeader className="pb-4 md:pt-6 pt-0">
              <div className="flex items-center gap-4">
                <p className='font-bold text-xl text-wrap'>{nextLessonGroup && nextLessonGroup.name}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex gap-6 flex-wrap'>
                {nextLessonLocation &&
                <span className='flex gap-2 items-center opacity-75'>
                  <MapPin width={22} />
                  <p className='font-bold'>
                    {nextLessonLocation.name}
                    <br />
                    <span className="opacity-50">{nextLessonLocation.address}</span>
                  </p>
                </span>
                }
                <span className='flex gap-2 items-center opacity-75'>
                  <Clock width={22} />
                  <p className='font-bold'>
                    {`${format(nextLesson.start, "p", {locale: hu})} - ${format(nextLesson.end, "p", {locale: hu})}`}
                    <br />
                    <span className="opacity-50">{format(nextLesson.start, "P", {locale: hu})}</span>
                  </p>
                </span>
                <span className='flex gap-2 items-center opacity-75'>
                  <User2 width={22} />
                  <p className='font-bold'>{nextLessonStudents && nextLessonStudents.length}</p>
                </span>
              </div>
            </CardContent>
          </div>
          <Button className="m-4 xl:ml-auto xl:h-28 xl:aspect-square flex xl:flex-col gap-4" variant="outline">
            <Play />
            Kezdés
          </Button>
          </> 
          :
          <CardContent>
            <p>Nincs Közelgő óra</p>
          </CardContent>
          }
        </Card>
        <Textarea placeholder="Jegyzetek" className="h-28 max-h-48" />
        <DataTable columns={columns} data={nextLessonStudents} hideColumns={["created", "parent_name"]} />
      </div>

      <div className='row-span-3 overflow-y-hidden bg-primary-foreground rounded-xl'>
        <WorkInProgress />
      </div>
    </div>
  )
}
