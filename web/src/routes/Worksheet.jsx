import AreYouSureAlert from '@/components/AreYouSureAlert'
import { Combobox } from '@/components/ComboBox'
import DataTable from '@/components/DataTable'
import { DatePicker } from '@/components/DatePicker'
import { TimePicker } from '@/components/TimePicker'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { create, getAll, getAllLessonsBetweenDates, getWorksheet, remove } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { isAdmin } from '@/lib/utils'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { ArrowDown, ArrowUp, ArrowUpDown, LoaderCircle, Plus, SquareArrowOutUpRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export default function Worksheet() {
  const auth = useAuth()
  const [worksheet, setWorksheet] = useState(null)
  const [selectableLessons, setSelectableLessons] = useState(null)

  const [rowSelection, setRowSelection] = useState({})
  const [showPaid, setshowPaid] = useState(false)

  const [newRowSelectedLesson, setNewRowSelectedLesson] = useState(null)
  const [newRowDate, setNewRowDate] = useState(new Date())
  useEffect(() => {
    getAllLessonsBetweenDates(
      auth.token,
      new Date(new Date(newRowDate).setHours(0, 0, 0, 0)),
      new Date(new Date(newRowDate).setHours(23, 59, 59, 999)),
      "group"
    ).then(resp => setSelectableLessons(resp.data.lessons.map(d => ({name: d.group.name, ...d}))))
    .catch(() => {setSelectableLessons([])})
  }, [newRowDate])

  useEffect(() => {
    getWorksheet(auth.token, auth.user.id, showPaid, "out,out.group,in")
      .then(
        resp => setWorksheet(resp.data.worksheet),
        (error) => {
          switch (error.response?.data?.code) {
            case "not_found":
              return setWorksheet([])
            case "unauthorized":
              return toast.error("Ehhez hincs jogosultsága!")
            default:
              return toast.error("Ismeretlen hiba történt!")
          }
        }
      )
  }, [auth.token, showPaid])

  function handleDelete() {
    remove(auth.token, 'worksheet', Object.keys(rowSelection).map(e => worksheet[+e].id)).then(resp => {
      setWorksheet(p => p.filter(e => !resp.data.worksheet.map(v => v.id).includes(e.id)))
      setRowSelection({})
    })
  }

  function handleAdd(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      out: formData.get("lesson"),
      start: formData.get("start"),
      end: formData.get("end")
    }
    create(auth.token, 'worksheet', data).then(() => {
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
    }, (error) => {
      switch (error.response?.data?.code) {
        case "bad_request":
          return toast.error("Valamelyik adat hibás!")
        case "unauthorized":
          return toast.error("Ehhez hincs jogosultsága!")
        default:
          return toast.error("Ismeretlen hiba történt!")
      }
    })
  }

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
      displayName: "Alkalmazott",
      accessorKey: "employee",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => <Link to={"/employees/"+row.original.in.id.replace("employee:", "")}><Button variant="outline">{row.original.in.name} <SquareArrowOutUpRight /></Button></Link>,
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
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => row.getValue("paid") ? "Igen" : "Nem",
    },
  ]
  
  return (
    <div className='max-w-screen-xl md:w-full mx-auto p-4'>
      <h1 className='text-4xl py-4'>Jelenléti ív</h1>
      <div className='flex gap-2 items-center'>
        <p>Fizetett sorok mutatása</p>
        <Switch checked={showPaid} onCheckedChange={(e) => setshowPaid(e)} />
      </div>
      <DataTable data={worksheet} columns={workColumns} rowSelection={rowSelection} setRowSelection={setRowSelection}
      hideColumns={["created", !isAdmin(auth.user.roles) ? "employee" : ""]}
      headerAfter={
        <>
          <AreYouSureAlert onConfirm={handleDelete} disabled={Object.keys(rowSelection).length == 0} />
          <Dialog>
            <DialogTrigger asChild><Button variant="outline">Hozzáadás <Plus /></Button></DialogTrigger>
            <DialogContent>
              <DialogTitle>Hozzáadás</DialogTitle>
              <form onSubmit={handleAdd} className='space-y-4'>
                <h4>Dátum *</h4>
                <DatePicker name={"date"} setDate={setNewRowDate} date={newRowDate} />
                <h4>Óra</h4>
                {selectableLessons?.length ? (<>
                  <Combobox data={selectableLessons || []} displayName={"name"} name={"lesson"} onSelectionChange={setNewRowSelectedLesson}/>
                  {newRowSelectedLesson && (() => {
                    const l = selectableLessons.find(e => e.id === newRowSelectedLesson)
                    return(
                    <Card>
                      <CardHeader>
                        <CardTitle>{l.name || l.group.name}</CardTitle>
                        <CardDescription>
                          {format(new Date(l.start), "yyyy. MM. dd.")}
                          {format(new Date(l.start), "hh:mm")} - {format(new Date(l.end), "hh:mm")}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )})()}
                </>) : (
                  <p className='text-muted-foreground'>Nincs óra ezen a napon!</p>
                )}
                <h4>Érkezés / Távozás *</h4>
                <div className='flex gap-2 items-center'>
                  <TimePicker name="start" />
                  -
                  <TimePicker name="end" />
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Mégse</Button></DialogClose>
                  <DialogClose asChild><Button type="submit">Mentés</Button></DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </>
      } />
    </div>
  )
}
