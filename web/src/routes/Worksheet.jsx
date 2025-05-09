import AreYouSureAlert from '@/components/AreYouSureAlert'
import DataTable from '@/components/DataTable'
import { DatePicker } from '@/components/DatePicker'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { create, getWorksheet, remove } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { isTeacher } from '@/lib/utils'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { LoaderCircle, Plus, SquareArrowOutUpRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export default function Worksheet() {
  const auth = useAuth()
  const [worksheet, setWorksheet] = useState(null)
  const [rowSelection, setRowSelection] = useState({})

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

  function handleDelete() {
    remove(auth.token, 'worksheet', Object.keys(rowSelection).map(e => worksheet[+e].id)).then(resp => {
      setWorksheet(p => p.filter(e => !resp.data.worksheet.map(v => v.id).includes(e.id)))
      setRowSelection({})
    })
  }

  function handleAdd(e) {
    create(auth.token, 'worksheet', Object.keys(rowSelection).map(e => worksheet[+e].id)).then(resp => {
      setWorksheet(p => p.filter(e => !resp.data.worksheet.map(v => v.id).includes(e.id)))
      setRowSelection({})
    })
  }

  if (!isTeacher(auth.user.roles)) return (
    <div className='size-full bg-background flex items-center justify-center'>
      <p>Nincs megjeleníthető adat</p>
    </div>
  )

  if (!worksheet) return (
    <div className='size-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin ' />
    </div>
  )

  const workColumns = [
    {
      id: "select",
      ignoreClickEvent: true,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          className="float-left"
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          className="float-left"
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
      <DataTable data={worksheet} columns={workColumns} rowSelection={rowSelection} setRowSelection={setRowSelection}
      headerAfter={
        <>
          <DatePicker showTimePicker includeTime />
          <AreYouSureAlert onConfirm={handleDelete} disabled={Object.keys(rowSelection).length == 0} />
          <Button variant="outline">Hozzáadás <Plus /></Button>
        </>
      } />
    </div>
  )
}
