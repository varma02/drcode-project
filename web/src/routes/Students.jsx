import AreYouSureAlert from '@/components/AreYouSureAlert'
import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { getAllGroups, getAllLocations, getAllStudents, getAllSubjects, getEmployee, removeStudent } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { ArrowDown, ArrowUp, ArrowUpDown, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Students() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [rowSelection, setRowSelection] = useState({})

  useEffect(() => {
    getAllStudents(auth.token).then(data => setStudents(data.data.students))
  }, [])

  function handleDelete() {
    removeStudent(auth.token, ...Object.keys(rowSelection).map(e => students[+e].id)).then(resp => {
      console.log(resp);
      setStudents(p => p.filter(e => !resp.data.students.find(f => f.id == e.id)))
    })
  }

  console.log(students)

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
      accessorKey: "notes",
      displayName: "Megjegyzés",
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
      <h1 className='text-4xl py-4'>Tanulók</h1>

      <DataTable data={students} columns={columns} rowSelection={rowSelection} setRowSelection={setRowSelection}
      rowOnClick={(row) => navigate(`/students/${row.original.id.replace("student:", "")}`)}
      headerAfter={<div className='flex gap-4 pl-4'>
        <AreYouSureAlert onConfirm={handleDelete} />
        <Link to='add'>
          <Button variant="outline"><Plus /> Hozzáadás</Button>
        </Link>
      </div>} />
    </div>
  )
}
