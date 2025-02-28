import DataTable from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { getEmployeeWithDetails, getGroup, getGroupWithDetails, getStudent, getSubject } from "@/lib/api/api"
import { useAuth } from "@/lib/api/AuthProvider"
import { format } from "date-fns"
import { hu, id } from "date-fns/locale"
import { ArrowDown, ArrowUp, ArrowUpDown, LoaderCircle, SquareArrowOutUpRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"

export default function EmployeeDetails() {
  const auth = useAuth()
  const params = useParams()

  const [employee, setEmployee] = useState(null)
  const [groups, setGroups] = useState(null)
  // const [students, setStudents] = useState(null)

  useEffect(() => {
    getEmployeeWithDetails(auth.token, "employee:" + params.id)
    .then(data => setEmployee(data.data.employees[0]))
  }, [auth.token, params.id]);

  useEffect(() => {
    if (!employee) return;

    const sids = new Set()
    employee.groups?.forEach(s => sids.add(s))
    if (sids.size !== 0)
      getGroup(auth.token, Array.from(sids))
      .then(data => setGroups(data.data.groups))
    else
      setGroups([])

    // const stids = new Set()
    // employee.enroled?.forEach(s => stids.add(s.in))
    // if (stids.size !== 0)
    //   getStudent(auth.token, Array.from(stids))
    //   .then(data => setStudents(data.data.students))
    // else
    //   setStudents([])
  }, [employee]);

  if (!employee) return (
    <div className='h-screen w-full bg-background flex items-center justify-center'>
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
    {
      displayName: "Megjegyzés",
      accessorKey: "notes",
      header: ({ column }) => column.columnDef.displayName,
    },
  ]
  return (
    <div className='max-w-screen-xl md:w-full mx-auto p-4'>
      <h1 className='text-4xl pt-4'>{employee.name}</h1>
      <h2 className='font-normal text-lg pb-4 text-foreground/70'>{employee.email}</h2>
      <div className="flex flex-col gap-2 py-4">
        <h3 className='font-bold'>Megjegyzés</h3>
        <Textarea id="notes" placeholder="Lorem ipsum dolor..." className="h-20 max-h-48" defaultValue={employee.notes} />
      </div>

      <div className="flex flex-col gap-2 py-4">
        <h3 className='font-bold'>Csoportok</h3>
        {groups?.length > 0 ? (
          <ScrollArea className='pb-2 overflow-x-auto'>
            <div className='flex w-max gap-4 pb-1'>
              {groups.map(group => (
                <Link to={`/groups/${group.id.replace("group:", "")}`} key={group.id}>
                  <Button variant='outline' className='flex items-center gap-2'>
                    {group.name} <SquareArrowOutUpRight />
                  </Button>
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : groups ? (
          <p>Ez az alkalmazott nem tanít egy csoportot sem.</p>
        ) : (
          <LoaderCircle className='animate-spin ' />
        )}
      </div>

      <div className="flex flex-col gap-2 py-4">
        <h3 className='font-bold'>Jelenléti Ív</h3>
        <DataTable className="-mt-4" columns={workColumns} data={employee.unpaid_work || []} />
      </div>
    </div>
  )
}