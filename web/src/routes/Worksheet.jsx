import AreYouSureAlert from '@/components/AreYouSureAlert'
import { Combobox } from '@/components/ComboBox'
import DataTable from '@/components/DataTable'
import { DatePicker } from '@/components/DatePicker'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { create, getAll, getWorksheet, remove } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { isTeacher } from '@/lib/utils'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { ArrowDown, ArrowUp, ArrowUpDown, LoaderCircle, Plus, SquareArrowOutUpRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export default function Worksheet() {
  const auth = useAuth()
  const [worksheet, setWorksheet] = useState(null)
  const [allLessons, setAllLessons] = useState(null)

  const [rowSelection, setRowSelection] = useState({})
  const [showPaid, setshowPaid] = useState(false)

  useEffect(() => {
    getWorksheet(auth.token, auth.user.id, showPaid, "out,out.group")
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
      out: formData.get("group"),
      start: formData.get("start"),
      end: formData.get("end")
    }
    create(auth.token, 'worksheet', data).then(_ => {
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

  if (!isTeacher(auth.user.roles)) return (
    <div className='size-full bg-background flex items-center justify-center'>
      <p>Nincs megjeleníthető adat</p>
    </div>
  )

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
        <p>Fizetett oszlopok mutatása</p>
        <Switch checked={showPaid} onCheckedChange={(e) => setshowPaid(e)} />
      </div>
      <DataTable data={worksheet} columns={workColumns} rowSelection={rowSelection} setRowSelection={setRowSelection}
      headerAfter={
        <>
          <AreYouSureAlert onConfirm={handleDelete} disabled={Object.keys(rowSelection).length == 0} />
          <Dialog>
            <DialogTrigger asChild><Button variant="outline">Hozzáadás <Plus /></Button></DialogTrigger>
            <DialogContent>
              <DialogTitle>Jelenléti ív hozzáadása</DialogTitle>
              <form onSubmit={handleAdd} className='space-y-4'>
                <Combobox data={allLessons || []} displayName={"name"} name={"group"} 
                  onOpenChange={e => e && !allLessons && 
                    getAll(auth.token, "lesson").then(resp => setAllLessons(resp.data.lessons))
                  } 
                  />
                <DatePicker includeTime showTimePicker name={"start"} />
                <DatePicker includeTime showTimePicker name={"end"} />
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
