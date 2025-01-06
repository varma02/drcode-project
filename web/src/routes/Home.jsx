import { AssignmentMessage, NotificationMessage } from '@/components/Messages'
import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Folder, ArrowUpDown, BookOpen, Clock, MapPin, User, User2, ArrowRight, ArrowUp, ArrowDown, Play } from 'lucide-react'
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ToggleButton } from '@/components/ToggleButton'
import { Textarea } from '@/components/ui/textarea'

export default function Home() {

  const courses = [
    "LEGO WeDo 2.0 két féléves",
    "C#",
    "Lego WeDo 2.0",
    "Kodular I.",
    "Hardver",
    "Webfejlesztés (új)",
    "Webfejlesztés",
    "C++",
    "Lego WeDo 1.0",
    "Scratch Mester",
    "Unity 1. félév",
    "Scratch 2017",
    "Kodular Eagle I",
    "SCRATCH EREDETI",
    "Scratch 2022",
    "Scratch 2023 CS.GY.",
    "Kodular Eagle II",
    "Unity 2. félév (3D)"
  ]

  const data = [
    {
      id: "m5gr84i9",
      grade: 5,
      status: "success",
      name: "UserName1",
      subject: "Scratch"
    },
    {
      id: "3u1reuv4",
      grade: 5,
      status: "success",
      name: "UserName2",
      subject: "Scratch"
    },
    {
      id: "derv1ws0",
      grade: 5,
      status: "processing",
      name: "UserName3",
      subject: "Scratch"
    },
    {
      id: "5kma53ae",
      grade: 4,
      status: "success",
      name: "UserName4",
      subject: "WeDo"
    },
    {
      id: "bhqecj4p",
      grade: 4,
      status: "failed",
      name: "UserName5",
      subject: "Scratch"
    },
    {
      id: "bhqecj4p",
      grade: 4,
      status: "failed",
      name: "UserName6",
      subject: "Scratch"
    },
    {
      id: "bhqecj4p",
      grade: 4,
      status: "failed",
      name: "UserName7",
      subject: "WeDo"
    },
  ]
  
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
      displayName: "Kurzus",
      accessorKey: "subject",
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
      displayName: "Osztály",
      accessorKey: "grade",
      header: "Osztály",
      cell: ({ row }) => (
        <div className="capitalize text-center">{row.getValue("grade")}</div>
      ),
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
      <div className='bg-primary-foreground rounded-xl p-4 row-span-3 h-full'>
        <h2 className='md:text-left text-center mb-4'>Következő óra</h2>
        <div className='flex gap-4 w-full h-full flex-col'>
          <Card className="w-full md:h-36 flex md:flex-row flex-col">
            <div className='p-4 pr-0 md:self-auto self-center md:w-32 w-20'>
              <img src="https://seeklogo.com/images/S/scratch-cat-logo-7F652C6253-seeklogo.com.png" className='object-cover object-center' />
            </div>
            <div className='flex flex-col'>
              <CardHeader className="pb-4 md:pt-6 pt-0">
                <div className="flex items-center gap-4">
                  <p className='font-bold text-xl text-wrap'>Scratch haladó, Lego WeDo 2.0</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex gap-6 flex-wrap'>
                  <span className='flex gap-2 items-center opacity-75'>
                    <MapPin width={22} />
                    <p className='font-bold'>
                      Arany János Általános Iskola
                      <br />
                      <span className="opacity-50">6000 Kecskemét, Lunkányi János u.</span>
                    </p>
                  </span>
                  <span className='flex gap-2 items-center opacity-75'>
                    <User2 width={22} />
                    <p className='font-bold'>6</p>
                  </span>
                  <span className='flex gap-2 items-center opacity-75'>
                    <Clock width={22} />
                    <p className='font-bold'>16:00 - 17:00</p>
                  </span>
                </div>
              </CardContent>
            </div>
            <Button className="m-4 md:ml-auto md:h-28 md:aspect-square flex md:flex-col gap-4" variant="outline">
              <Play />
              Kezdés
            </Button>
          </Card>
          <Textarea placeholder="Jegyzetek" className="h-28 max-h-48" />
          <ScrollArea className="h-[calc(100%-3rem)] pb-12">
            <DataTable columns={columns} data={data} className={"w-full h-full"} />
          </ScrollArea>
        </div>
      </div>


      <div className='bg-primary-foreground rounded-xl p-4 h-full row-span-2'>
        <h2 className='md:text-left text-center mb-4'>Üzenetek</h2>
        <ScrollArea className="h-[calc(100%-3rem)]">
            <AssignmentMessage />
            <NotificationMessage />
        </ScrollArea>
      </div>


      <div className='bg-primary-foreground rounded-xl p-4'>
        <h2 className='md:text-left text-center mb-2'>Segédletek</h2>
        <ScrollArea className='h-16 overflow-x-auto gap-2 py-2'>
          <div className='flex w-max gap-2'>
            {courses.map(e => <Button variant="outline" key={e} className="font-bold text-xl"><Folder strokeWidth={4} /> {e}</Button>)}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}
