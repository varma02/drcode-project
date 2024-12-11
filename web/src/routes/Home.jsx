import { QuestMessage, YappingMessage } from '@/components/Messages'
import DataTable from '@/components/DataTable'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Folder, MessageSquare, ArrowUpDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import React from 'react'

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
      grade: 316,
      status: "success",
      name: "ken99@yahoo.com",
    },
    {
      id: "3u1reuv4",
      grade: 242,
      status: "success",
      name: "Abe45@gmail.com",
    },
    {
      id: "derv1ws0",
      grade: 837,
      status: "processing",
      name: "Monserrat44@gmail.com",
    },
    {
      id: "5kma53ae",
      grade: 874,
      status: "success",
      name: "Silas22@gmail.com",
    },
    {
      id: "bhqecj4p",
      grade: 721,
      status: "failed",
      name: "carmella@hotmail.com",
    },
  ]
  
  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      displayName: "Státusz",
      accessorKey: "status",
      header: "Státusz",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
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
        <div className="capitalize">{row.getValue("grade")}</div>
      ),
    },
  ]

  return (
    <div className='flex flex-col md:grid grid-cols-2 h-full grid-rows-2 gap-4'>
      <div className='bg-primary-foreground rounded-xl p-4'>
        <h2 className='text-center mb-4'>Következő óra</h2>
        <div>
          <DataTable columns={columns} data={data} />
        </div>
      </div>
      <div className='bg-primary-foreground row-span-2 rounded-xl p-4'>
        <h2 className='text-center mb-4'>Üzenetek</h2>
        <div className='flex flex-col gap-2'>
          <QuestMessage />
          <YappingMessage />
        </div>
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
