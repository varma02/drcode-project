import AreYouSureAlert from '@/components/AreYouSureAlert'
import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { getAll, remove } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { ArrowDown, ArrowUp, ArrowUpDown, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Locations() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState([])
  const [rowSelection, setRowSelection] = useState({})

  useEffect(() => {
    getAll(auth.token, 'subject').then(data => setSubjects(data.data.subjects))
  }, [])

  function handleDelete() {
    remove(auth.token, 'subject', Object.keys(rowSelection).map(e => subjects[+e].id)).then(resp => {
      setSubjects(p => p.filter(e => !resp.data.subjects.includes(e.id)))
      setRowSelection({})
    })
  }

  const columns = [
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
      accessorKey: "description",
      displayName: "Leírás",
      header: ({ column }) => column.columnDef.displayName,
    },
    {
      displayName: "Létrehozva",
      accessorKey: "created",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => format(new Date(row.getValue("created")), "P", {locale: hu}),
    },
  ]

  return (
    <div className='max-w-screen-xl md:w-full mx-auto p-4'>
      <h1 className='text-4xl py-4'>Kurzusok</h1>

      <DataTable data={subjects} columns={columns} rowOnClick={(row) => navigate(row.original.id.replace("subject:", ""))}
      rowSelection={rowSelection} setRowSelection={setRowSelection}
      headerAfter={<div className='flex gap-4'>
        <AreYouSureAlert onConfirm={handleDelete} disabled={Object.keys(rowSelection).length == 0} />
        <Link to='add'>
          <Button variant="outline"><Plus /> Hozzáadás</Button>
        </Link>
      </div>} />
    </div>
  )
}
