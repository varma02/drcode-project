import AreYouSureAlert from '@/components/AreYouSureAlert'
import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { getAllGroups, getAllLessons, getAllLocations, getAllSubjects, getEmployee, getGroup, removeLesson, removeSubject } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { ArrowDown, ArrowUp, ArrowUpDown, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Lessons() {
  const auth = useAuth()
  const [lessons, setLessons] = useState([])
  const [groups, setGroups] = useState([])
  const [rowSelection, setRowSelection] = useState({})

  useEffect(() => {
    getAllLessons(auth.token).then(data => setLessons(data.data.lessons))
  }, [])

  useEffect(() => {
      if (!lessons) return;
      const gids = new Set()
      lessons.forEach(s => s.group && gids.add(s.group))
      if (gids.size !== 0)
        getGroup(auth.token, Array.from(gids))
        .then(data => setGroups(data.data.groups))
      else
        setGroups([])
    }, [lessons]);

  function handleDelete() {
    removeLesson(auth.token, ...Object.keys(rowSelection).map(e => lessons[+e].id)).then(resp => {
      setLessons(p => p.filter(e => !resp.data.lessons.find(f => f.id == e.id)))
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
      accessorKey: "name",
      displayName: "Név",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => groups.find((v) => v.id == row.original.group)?.name || row.original.name,
    },
    {
      id: "date",
      displayName: "Dátum",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => format(new Date(row.original.start), "P", {locale: hu}),
    },
    {
      id: "start",
      displayName: "Kezdés",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => format(new Date(row.original.start), "p", {locale: hu}),
    },
    {
      id: "end",
      displayName: "Befejezés",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => format(new Date(row.original.end), "p", {locale: hu}),
    },
    {
      accessorKey: "notes",
      displayName: "Leírás",
      header: ({ column }) => column.columnDef.displayName,
    },
    {
      displayName: "Létrehozva",
      accessorKey: "created",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => format(new Date(row.getValue("created")), "P", {locale: hu}),
      hidden: true,
    },
  ]
  return (
    <div className='max-w-screen-xl md:w-full mx-auto p-4'>
      <h1 className='text-4xl py-4'>Órák</h1>

      <DataTable data={lessons} columns={columns}
      rowSelection={rowSelection} setRowSelection={setRowSelection}
      headerAfter={<div className='flex gap-4 pl-4'>
        <AreYouSureAlert onConfirm={handleDelete} />
        <Link to='add'>
          <Button variant="outline"><Plus /> Hozzáadás</Button>
        </Link>
      </div>} />
    </div>
  )
}
