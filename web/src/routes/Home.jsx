import { AssignmentMessage, NotificationMessage } from '@/components/Messages'
import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Folder, ArrowUpDown, BookOpen, Clock, MapPin, User, User2, ArrowRight } from 'lucide-react'
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ToggleButton } from '@/components/ToggleButton'

export const Home = () => {

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
    },
    {
      id: "3u1reuv4",
      grade: 5,
      status: "success",
      name: "UserName2",
    },
    {
      id: "derv1ws0",
      grade: 5,
      status: "processing",
      name: "UserName3",
    },
    {
      id: "5kma53ae",
      grade: 4,
      status: "success",
      name: "UserName4",
    },
    {
      id: "bhqecj4p",
      grade: 4,
      status: "failed",
      name: "UserName5",
    },
    {
      id: "bhqecj4p",
      grade: 4,
      status: "failed",
      name: "UserName6",
    },
    {
      id: "bhqecj4p",
      grade: 4,
      status: "failed",
      name: "UserName7",
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
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
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
    <div className='flex flex-col md:grid grid-cols-2 h-full grid-rows-2 gap-4 overflow-y-hidden'>
      <div className='bg-primary-foreground rounded-xl p-4 row-span-2 h-full'>
        <h2 className='text-center mb-4'>Következő óra</h2>
        <div className='flex gap-4 w-full h-full flex-col'>
          <Card className="max-w-[35rem] w-full h-max">
            <CardHeader>
              <div className="flex items-center gap-4">
                <img src="https://seeklogo.com/images/S/scratch-cat-logo-7F652C6253-seeklogo.com.png" className='max-w-12 object-cover object-center' />
                <p className='font-bold text-xl'>Scratch, WeDo</p>
                <span className='flex gap-1 items-center opacity-75 ml-auto'>
                  <User2 width={20} />
                  <p className='font-bold'>6</p>
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex justify-between'>
                <span className='flex gap-1 items-center opacity-75'>
                  <ArrowRight width={16} />
                  <p className='font-bold'>Arany Iskola</p>
                </span>
                <span className='flex gap-1 items-center opacity-75'>
                  <Clock width={16} />
                  <p className='font-bold'>16:00</p>
                </span>
              </div>
            </CardContent>
          </Card>
          {/* <Card className="w-full h-full">
            <CardContent className="mt-6">
              <div className='flex items-center gap-4'>
                <img src="https://seeklogo.com/images/S/scratch-cat-logo-7F652C6253-seeklogo.com.png" className='max-w-36 object-cover object-center' />
                <div className='flex flex-col gap-2'>
                  <div className='flex gap-2'><BookOpen /> <p>Scratch</p></div>
                  <div className='flex gap-2'><Clock /> <p>Hétfő 16:00</p></div>
                  <div className='flex gap-2'><MapPin />  <p>Arany Iskola</p></div>
                  <div className='flex gap-2'><User2 />  <p>6</p></div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full font-bold">Segédlet</Button>
            </CardFooter>
          </Card> */}
          <ScrollArea className="h-[calc(100%-3rem)] pb-12">
            <DataTable columns={columns} data={data} className={"w-full h-full"} />
          </ScrollArea>
        </div>
      </div>
      <div className='bg-primary-foreground rounded-xl p-4 h-full'>
        <h2 className='text-center mb-4'>Üzenetek</h2>
        <ScrollArea className="h-[calc(100%-3rem)]">
            <AssignmentMessage />
            <NotificationMessage />
        </ScrollArea>
      </div>
      <div className='bg-primary-foreground rounded-xl p-4'>
        <h2 className='text-center mb-2'>Segédletek</h2>
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
