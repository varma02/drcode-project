import AreYouSureAlert from '@/components/AreYouSureAlert'
import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { getAllGroups, getEmployee } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { ArrowDown, ArrowUp, ArrowUpDown, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Groups() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [teachers, setTeachers] = useState({})

  useEffect(() => {
    getAllGroups(auth.token).then(data => setGroups(data.data.groups))
  }, [])

  useEffect(() => {
    const tids = new Set()
    groups.forEach(e => e.teachers.forEach(t => tids.add(t)))
    if (tids.size === 0) return;
    getEmployee(auth.token, Array.from(tids)).then(data => {
      const temp = {}
      data.data.employees.forEach(e => temp[e.id] = e.name)
      setTeachers(temp)
    });
  }, [groups])

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
      displayName: "Helyszín",
      accessorKey: "location",
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
      cell: ({ row }) => (row.getValue("location")?.name || "N/A"),
    },
    {
      displayName: "Tanárok",
      accessorKey: "teachers",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => row.getValue("teachers")?.map(e => teachers[e]).join(", ") || "N/A",
    },
    {
      displayName: "Létrehozva",
      accessorKey: "created",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => (
        <div className="capitalize text-center">{format(new Date(row.getValue("created")), "P", {locale: hu} )}</div>
      ),
    },
  ]
  return (
    <div className='max-w-screen-xl md:w-full mx-auto p-4'>
      <h1 className='text-4xl py-4'>Csoportok</h1>

      <DataTable data={groups} columns={columns} rowOnClick={(row) => navigate(row.original.id.replace("group:", ""))}
      headerAfter={<div className='flex gap-4 pl-4'>
        <AreYouSureAlert />
        <Link to='add'>
          <Button variant="outline"><Plus /> Hozzáadás</Button>
        </Link>
      </div>} />
    </div>
  )
}
