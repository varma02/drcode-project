import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { getWorksheet } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { LoaderCircle, Plus, SquareArrowOutUpRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export default function Worksheet() {
  const auth = useAuth()
  const [worksheet, setWorksheet] = useState(null)

  useEffect(() => {
    getWorksheet(auth.token, auth.user.id, undefined, "out,out.group")
      .then(
        resp => setWorksheet(resp.data.worksheet),
        (error) => {
          switch (error.response?.data?.code) {
            case "not_found":
              return toast.error("Nincs megjeleníthető adat!")
            case "unauthorized":
              return toast.error("Ehhez hincs jogosultsága!")
            default:
              return toast.error("Ismeretlen hiba történt!")
          }
        }
      )
  }, [auth.token])

  if (!worksheet) return (
    <div className='size-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin ' />
    </div>
  )

  const workColumns = [
    {
      displayName: "Csoport",
      accessorKey: "group",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => <Link to={"/groups/"+row.original.out.group.id.replace("group:", "")}><Button variant="outline">{row.original.out.group.name} <SquareArrowOutUpRight /></Button></Link>,
    },
    {
      displayName: "Dátum",
      accessorKey: "date",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => format(new Date(row.getValue("start")), "P", {locale: hu}),
    },
    {
      displayName: "Érkezés",
      accessorKey: "start",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => format(new Date(row.getValue("start")), "p", {locale: hu}),
    },
    {
      displayName: "Távozás",
      accessorKey: "end",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => format(new Date(row.getValue("end")), "p", {locale: hu}),
    },
    {
      displayName: "Fizetett",
      accessorKey: "paid",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => row.getValue("paid") ? "Igen" : "Nem",
    },
  ]
  
  return (
    <div className='max-w-screen-xl md:w-full mx-auto p-4'>
      <h1 className='text-4xl py-4'>Jelenléti ív</h1>
      <DataTable data={worksheet} columns={workColumns} 
      headerAfter={
        <Button variant="outline">Hozzáadás <Plus /></Button>
      } />
    </div>
  )
}
