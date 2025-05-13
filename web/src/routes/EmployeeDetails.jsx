import AreYouSureAlert from "@/components/AreYouSureAlert"
import DataTable from "@/components/DataTable"
import { ToggleButton } from "@/components/ToggleButton"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { create, get, remove, update } from "@/lib/api/api"
import { useAuth } from "@/lib/api/AuthProvider"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { LoaderCircle, SquareArrowOutUpRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"
import NotFound from "./NotFound"
import { isAdmin } from "@/lib/utils"

export default function EmployeeDetails() {
  const auth = useAuth()
  const params = useParams()

  const [employee, setEmployee] = useState(null)
  const [worksheet, setWorksheet] = useState(null)

  const [rowSelection, setRowSelection] = useState({})

  useEffect(() => {
    get(auth.token, 'employee', ["employee:" + params.id], "groups,worksheet.out", "groups,worksheet")
    .then(data => {
      const emp = data.data.employees[0]
      setEmployee(emp)
      setWorksheet(data.data.employees[0].worksheet)
    })
  }, [auth.token, params.id])

  function handleDelete() {
    remove(auth.token, 'worksheet', Object.keys(rowSelection).map(e => worksheet[+e].id)).then(resp => {
      setWorksheet(p => p.filter(e => !resp.data.worksheet.map(v => v.id).includes(e.id)))
      setRowSelection({})
    })
  }

  function setWorksheetPaid(id, newPaidValue) {
    setWorksheet(p =>
      p.map((worksheet) =>
        worksheet.id == id ? { ...worksheet, paid: newPaidValue } : worksheet
      )
    )
  }

  if (!isAdmin(auth.user.roles)) return <NotFound />

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
      displayName: "Csoport",
      accessorKey: "group",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => {
        const group = employee.groups.find(e => e.id == row.original.out.group)
        return <Link to={"/groups/"+group.id.replace("group:", "")}><Button variant="outline">{group.name} <SquareArrowOutUpRight /></Button></Link>
      },
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
      cell: ({ row }) => <ToggleButton onText={"Igen"} offText={"Nem"} value={row.getValue("paid")} onch={e => {
        update(auth.token, "worksheet", row.original.id, {paid: !e})
          .then(resp => {
            setWorksheetPaid(row.original.id, !e)
            toast.success("Fizetés módosítva!")
          })
      }} />,
    },
  ]

  return (
    <div className='max-w-screen-xl md:w-full mx-auto p-4'>
      <h1 className='text-4xl pt-4'>{employee.name}</h1>
      <h2 className='font-normal text-lg pb-4 text-foreground/70'>{employee.email}</h2>

      <div className="flex flex-col gap-2 py-4">
        <h3 className='font-bold'>Csoportok</h3>
        {employee.groups.length > 0 ? (
          <ScrollArea className='pb-2 overflow-x-auto'>
            <div className='flex w-max gap-4 pb-1'>
              {employee.groups.map(group => (
                <Link to={`/groups/${group.id.replace("group:", "")}`} key={group.id}>
                  <Button variant='outline' className='flex items-center gap-2'>
                    {group.name} <SquareArrowOutUpRight />
                  </Button>
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <p>Ez az alkalmazott nem tanít egy csoportot sem.</p>
        )}
      </div>

      <div className="flex flex-col gap-2 py-4">
        <h3 className='font-bold'>Jelenléti Ív</h3>
        <DataTable className="-mt-4" columns={workColumns} data={worksheet || []} 
          rowSelection={rowSelection} setRowSelection={setRowSelection} 
          headerAfter={
            <AreYouSureAlert onConfirm={handleDelete} disabled={Object.keys(rowSelection).length == 0} />
          }
          />
      </div>
    </div>
  )
}