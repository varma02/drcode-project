import AreYouSureAlert from "@/components/AreYouSureAlert"
import { Combobox } from "@/components/ComboBox"
import DataTable from "@/components/DataTable"
import { DatePicker } from "@/components/DatePicker"
import { ToggleButton } from "@/components/ToggleButton"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { create, get, getAllLessonsBetweenDates, remove, update } from "@/lib/api/api"
import { useAuth } from "@/lib/api/AuthProvider"
import { Dialog } from "@radix-ui/react-dialog"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { ArrowDown, ArrowUp, ArrowUpDown, LoaderCircle, Plus, SquareArrowOutUpRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

export default function EmployeeDetails() {
  const auth = useAuth()
  const params = useParams()

  const [employee, setEmployee] = useState(null)
  const [worksheet, setWorksheet] = useState(null)

  const [rowSelection, setRowSelection] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedDateLessons, setSelectedDateLessons] = useState([])
  const [groups, setGroups] = useState([])

  useEffect(() => {
    get(auth.token, 'employee', ["employee:" + params.id], "groups,worksheet.out", "groups,worksheet")
    .then(data => {
      const emp = data.data.employees[0]
      setEmployee(emp)
      setWorksheet(data.data.employees[0].worksheet)
      get(auth.token, "group", emp.worksheet.filter(w => Object.keys(w).includes("out")).map(w => w.out.group)).then(r => setGroups(r.data.groups))
    })
  }, [auth.token, params.id])

  console.log("E: ", employee)
  console.log("G: ",groups)

  function handleDelete() {
    remove(auth.token, 'worksheet', Object.keys(rowSelection).map(e => worksheet[+e].id)).then(resp => {
      setWorksheet(p => p.filter(e => !resp.data.worksheet.map(v => v.id).includes(e.id)))
      setRowSelection({})
    })
  }

  useEffect(() => {
    setSelectedDateLessons([])
    const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0)
    const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59)
    getAllLessonsBetweenDates(auth.token, startOfDay, endOfDay, "group").then(resp => setSelectedDateLessons(resp.data.lessons))
  }, [selectedDate])

  function setWorksheetPaid(id, newPaidValue) {
    setWorksheet(p =>
      p.map((worksheet) =>
        worksheet.id == id ? { ...worksheet, paid: newPaidValue } : worksheet
      )
    )
  }

  function handleAddWorksheet(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      employee: "employee:"+params.id,
      start: formData.get("start"),
      end: formData.get("end"),
      out: formData.get("lesson") != "" ? formData.get("lesson") : "lesson:none"
    }
    create(auth.token, "worksheet", data)
      .then(resp => {
        toast.success("Sikeres hozzádás")
        get(auth.token, 'employee', ["employee:" + params.id], "groups,worksheet.out", "groups,worksheet")
          .then(data => {
            const emp = data.data.employees[0]
            setEmployee(emp)
            setWorksheet(data.data.employees[0].worksheet)
            get(auth.token, "group", emp.worksheet.filter(w => Object.keys(w).includes("out")).map(w => w.out.group)).then(r => setGroups(r.data.groups))
          })
      }, (error) => {
        switch (error.response?.data?.code) {
          case "unauthorized" : return toast.error("Ehhez hincs jogosultsága!");
          case "bad_request": return toast.error("Valamelyik mező üres!")
          default: return toast.error("Ismeretlen hiba történt!")
        }})
    console.log(data)
  }

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
        if (!row.original.out) return <p>Megbízás</p>
        const group = [...employee.groups, ...groups].find(e => e.id == row.original.out.group)
        if (group) return <Link to={"/groups/"+group.id.replace("group:", "")}><Button variant="outline">{group.name} <SquareArrowOutUpRight /></Button></Link>
        return <p>Megbízás</p>
      },
    },
    {
      displayName: "Dátum",
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {column.columnDef.displayName}
            {!column.getIsSorted() ? (
              <ArrowUpDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowDown />
            ) : (
              <ArrowUp />
            )}
          </Button>
        );
      },
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
      ignoreClickEvent: true,
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
            <>
            <AreYouSureAlert onConfirm={handleDelete} disabled={Object.keys(rowSelection).length == 0} />
            <Dialog>
              <DialogTrigger asChild><Button variant="outline"><Plus /> Hozzáadás</Button></DialogTrigger>
              <DialogContent aria-describedby={undefined}>
                <DialogTitle>Jelenléti ív</DialogTitle>
                <form className="flex flex-col gap-2" onSubmit={handleAddWorksheet}>
                  <p>Óra</p>
                  <div className="flex flex-col gap-2">
                    <DatePicker date={selectedDate} setDate={setSelectedDate} />
                    <Combobox data={selectedDateLessons} displayName={"group.name"} placeholder="Válassz órát" name="lesson" />
                  </div>
                  <p>Érkezés*</p>
                  <DatePicker showTimePicker includeTime required dateFormat="PPPp" name={"start"} />
                  <p>Távozás*</p>
                  <DatePicker showTimePicker includeTime required dateFormat="PPPp" name={"end"} />
                  <div className="flex justify-end gap-4">
                    <DialogClose asChild><Button variant="outline">Mégse</Button></DialogClose>
                    <DialogClose asChild><Button type="submit">Hozzáadás</Button></DialogClose>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            </>
          }
          />
      </div>
    </div>
  )
}