import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { getWorksheet } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { LoaderCircle, Plug, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
export default function Worksheet() {
  const auth = useAuth()
  const [worksheet, setWorksheet] = useState(null)

  useEffect(() => {
    getWorksheet(auth.token, auth.user.id).then(resp => setWorksheet(resp.data.worksheet))
  }, [auth.token])

  if (!worksheet) return (
    <div className='h-screen w-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin ' />
    </div>
  )

  const workColumns = [
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
