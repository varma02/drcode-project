import DataTable from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { getEmployee, getGroup, getGroupWithDetails, getStudent, getSubject } from "@/lib/api/api"
import { useAuth } from "@/lib/api/AuthProvider"
import { format } from "date-fns"
import { hu, id } from "date-fns/locale"
import { ArrowDown, ArrowUp, ArrowUpDown, LoaderCircle, SquareArrowOutUpRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"

export default function GroupDetails() {
  const auth = useAuth()
  const params = useParams()

  const [group, setGroup] = useState(null)
  const [subjects, setSubjects] = useState(null)
  const [students, setStudents] = useState(null)
  const [teachers, setTeachers] = useState(null)

  useEffect(() => {
    getGroupWithDetails(auth.token, "group:" + params.id)
    .then(data => setGroup(data.data.groups[0]))
  }, [auth.token, params.id]);

  useEffect(() => {
    if (!group) return;

    const sids = new Set()
    group.subjects?.forEach(s => sids.add(s))
    if (sids.size !== 0)
      getSubject(auth.token, Array.from(sids))
      .then(data => setSubjects(data.data.subjects))
    else
      setSubjects([])

    const stids = new Set()
    group.enroled?.forEach(s => stids.add(s.in))
    if (stids.size !== 0)
      getStudent(auth.token, Array.from(stids))
      .then(data => setStudents(data.data.students))
    else
      setStudents([])

    const tids = new Set()
    group.teachers?.forEach(s => tids.add(s))
    if (tids.size !== 0)
      getEmployee(auth.token, Array.from(tids))
      .then(data => setTeachers(data.data.employees))
    else
      setTeachers([])
  }, [group]);


  if (!group) return (
    <div className='h-screen w-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin ' />
    </div>
  )

  const studentColumns = [
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
      id: "name",
      displayName: "Név",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => students.find(s => s.id == row.original.in)?.name,
    },
    {
      id: "grade",
      displayName: "Évfolyam",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => students.find(s => s.id == row.original.in)?.grade,
      
    },
    {
      id: "subject",
      displayName: "Kurzus",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => subjects.find(s => s.id == row.original.subject)?.name,
    },
    {
      displayName: "Csoportba felvéve",
      accessorKey: "created",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => (
        <div className="capitalize text-center">{format(new Date(row.getValue("created")), "P", {locale: hu} )}</div>
      ),
    },
  ]
  return (
    <div className='max-w-screen-xl md:w-full mx-auto p-4'>
      <h1 className='text-4xl py-4'>{group.name}</h1>
      <div className="flex flex-col gap-2 py-4">
        <h3 className='font-bold'>Megjegyzés</h3>
        <Textarea id="notes" placeholder="Lorem ipsum dolor..." className="h-28 max-h-48" defaultValue={group.notes} />
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-10">
        <div className="flex flex-col gap-2 py-4">
          <h3 className='font-bold'>Tanárok</h3>
          {teachers?.length > 0 ? (
            <ScrollArea className='pb-2 overflow-x-auto'>
              <div className='flex w-max gap-4 pb-1'>
                {teachers.map(teacher => (
                  <Link to={`/employee/${teacher.id.replace("employee:", "")}`} key={teacher.id}>
                    <Button variant='outline' className='flex items-center gap-2'>
                      {teacher.name} <SquareArrowOutUpRight />
                    </Button>
                  </Link>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : teachers ? (
            <p>Ehhez a csoporthoz még nem tartoznak tanárok.</p>
          ) : (
            <LoaderCircle className='animate-spin ' />
          )}
        </div>

        <div className="flex flex-col gap-2 py-4">
          <h3 className='font-bold'>Kurzusok</h3>
          {subjects?.length > 0 ? (
            <ScrollArea className='pb-2 overflow-x-auto'>
              <div className='flex w-max gap-4 pb-1'>
                {subjects.map(subject => (
                  <Link to={`/subjects/${subject.id.replace("subject:", "")}`} key={subject.id}>
                    <Button variant='outline' className='flex items-center gap-2'>
                      {subject.name} <SquareArrowOutUpRight />
                    </Button>
                  </Link>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : subjects ? (
            <p>Ehhez a csoporthoz még nem tartoznak kurzusok.</p>
          ) : (
            <LoaderCircle className='animate-spin ' />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <h3 className='font-bold'>Tanulók</h3>
        {students?.length > 0 ? (
          <DataTable className="-mt-4" columns={studentColumns} data={group.enroled} />
        ) : students ? (
          <p>Ehhez a csoporthoz még nem tartoznak kurzusok</p>
        ) : (
          <LoaderCircle className='animate-spin ' />
        )}
      </div>
    </div>
  )
}