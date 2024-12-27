import DataTable from '@/components/DataTable';
import { ToggleButton } from '@/components/ToggleButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getAllEmployees } from '@/lib/api/api';
import { useAuth } from '@/lib/api/AuthProvider';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { ArrowUpDown } from 'lucide-react';
import React, { useEffect, useState } from 'react'

export const Employee = () => {
  const auth = useAuth();

  const [employees, setEmployees] = useState([])

  useEffect(() => {
    getAllEmployees(auth.token).then(e => setEmployees(e.data.employees))
  }, [])

  const translation = {
    "administrator" : "Adminisztrátor",
    "teacher" : "Tanár",
  }
  
  const columns = [
    {
      id: "select",
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
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className='flex items-center gap-2'>
        <Avatar className="size-12">
          <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
          <AvatarFallback className="text-4xl font-bold">{auth.user.name.split(" ").slice(0, 2).map(v => v[0]).join("")}</AvatarFallback>
        </Avatar>
        {row.getValue("name")}
      </div>,
    },
    {
      displayName: "Email",
      accessorKey: "email",
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
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      displayName: "Létrehozva",
      accessorKey: "created",
      header: "Létrehozva",
      cell: ({ row }) => (
        <div className="capitalize text-center">{format(new Date(row.getValue("created")), "PPP", {locale: hu} )}</div>
      ),
    },
    {
      displayName: "Szerepkör",
      accessorKey: "roles",
      header: "Szerepkör",
      cell: ({ row }) => <div className='flex gap-2'>
        {[...row.getValue("roles").map(e => <Badge key={e} className={`${e == "administrator" ? "bg-red-500" : "bg-green-500"} font-bold pointer-events-none`}>{translation[e]}</Badge>)]}
      </div>,
    },
  ]
  
  return (
    <div>
      {
        <DataTable data={employees} columns={columns} />
      }
    </div>
  )
}
