import AreYouSureAlert from '@/components/AreYouSureAlert'
import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { get, getAll, remove } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { role_map } from '@/lib/utils'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { ArrowDown, ArrowUp, ArrowUpDown, Plus, SquareArrowOutUpRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Invites() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [invites, setInvites] = useState([])
  const [rowSelection, setRowSelection] = useState({})

  useEffect(() => {
    getAll(auth.token, 'invite', "author").then(data => setInvites(data.data.invites))
  }, [auth.token])



  console.log(invites)

  const columns = [
    {
      displayName: "Létrehozta",
      accessorKey: "author",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => (
        // <Link to={"/employees/"+row.original.author.id.replace("employee:", "")}><Button variant="outline">{row.original.author.name} <SquareArrowOutUpRight /></Button></Link>
        <div className="capitalize text-center">{row.original.author.name}</div>
      ),
    },
    {
      displayName: "Szerepkörök",
      accessorKey: "roles",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => (
        <div className="capitalize text-center">{row.original.roles.map(e => role_map[e]).join(", ")}</div>
      ),
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
      <h1 className='text-4xl py-4'>Meghívók</h1>

      <DataTable data={invites} columns={columns} rowOnClick={(row) => navigate(row.original.id.replace("group:", ""))}
      rowSelection={rowSelection} setRowSelection={setRowSelection}  hideColumns={[]}/>
    </div>
  )
}
