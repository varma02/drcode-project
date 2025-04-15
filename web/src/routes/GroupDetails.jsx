import DataTable from "@/components/DataTable"
import { MultiSelect } from "@/components/MultiSelect"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { getAllEmployees, getAllSubjects, getEmployee, getGroupWithDetails, getStudent, getSubject, updateGroup } from "@/lib/api/api"
import { useAuth } from "@/lib/api/AuthProvider"
import { convertToMultiSelectData } from "@/lib/utils"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { Edit, LoaderCircle, Save, SquareArrowOutUpRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"

export default function GroupDetails() {
  const auth = useAuth()
  const params = useParams()

  const [group, setGroup] = useState(null)
  const [allSubjects, setAllSubjects] = useState([])
  const [allTeachers, setAllTeachers] = useState([])
  const [students, setStudents] = useState(null)
  const [teachers, setTeachers] = useState(null)
  const [subjects, setSubjects] = useState(null)

  const [editName, setEditName] = useState(false)
  const [editTeachers, setEditTeachers] = useState(false)
  const [editSubject, setEditSubject] = useState(false)

  useEffect(() => {
    getGroupWithDetails(auth.token, "group:" + params.id).then(data => setGroup(data.data.groups[0]))
    getAllSubjects(auth.token).then(resp => setAllSubjects(resp.data.subjects))
    getAllEmployees(auth.token).then(resp => setAllTeachers(resp.data.employees))
  }, [auth.token, params.id]);

  console.log(group)

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

  
  const [saveTimer, setSaveTimer] = useState(0)
  function handleChange(e) {
    console.log(e)
    if (saveTimer == 0) {
      const interval = setInterval(() => {
        setSaveTimer((o) => {
          if (o >= 50) {
            clearInterval(interval);
            handleSave({preventDefault: e.preventDefault, target: e.target.form});
            return 0;
          } else {
            return o + 1;
          }
        })
      }, 50);
    }
    setSaveTimer(1);
  }

  const [saveLoading, setSaveLoading] = useState(false)
  function handleSave(e) {
    e.preventDefault()
    if (saveLoading) return;
    setSaveLoading(true);
    const data = new FormData(e.target);
    console.log(data)
    const groupData = {
      id: "group:" + params.id,
      name: data.get("groupName"),
      teachers: data.get("groupTeachers") || teachers.map(e => e.id)
    };
    updateGroup(auth.token, groupData)
    .then((v) => {
      setLesson((o) => ({...o, ...v.data.group}));
      toast.success("Csoport mentve");
    }).catch(() => toast.error("Hiba történt mentés közben!"))
    .finally(() => setSaveLoading(false))

    setSaveLoading(false)
  }


  if (!group) return (
    <div className='h-screen w-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin' />
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
      cell: ({ row }) => subjects?.find(s => s.id == row.original.subject)?.name,
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
    <form className='max-w-screen-xl md:w-full mx-auto p-4' onChange={handleChange} onSubmit={(e) => handleSave(e)}>
      <div className="flex gap-2 group items-center">
        <Input defaultValue={group.name} name="groupName" className={`w-max !text-4xl ${!editName ? "border-transparent" : ""} h-max disabled:opacity-100 !cursor-text transition-colors`} disabled={!editName} />
        <Button variant="ghost" size="icon" className="group-hover:opacity-100 opacity-0"
        onClick={() => setEditName((o) => !o)} type="button">
          <Edit />
        </Button>

        <Button size="icon" className="ml-auto" type="submit" disabled={saveLoading}>
          {saveLoading ? <LoaderCircle className="animate-spin" /> : <Save />}
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row lg:gap-10 flex-wrap">
        <div className="flex flex-col gap-2 py-4 group">
          <h3 className='font-bold'>Oktatók</h3>
          <div className="flex gap-2">
            { allTeachers.length != 0 && !!teachers &&
              <MultiSelect 
                options={convertToMultiSelectData(allTeachers)} 
                defaultValue={[...teachers?.map(e => e.id)]} 
                onValueChange={(e) => setTeachers(allTeachers.filter(item => e.includes(item.id)))} 
                name="groupTeachers" className={`${editName ? "hidden" : "block"}`} />
            }
            {teachers?.length > 0 ? (
              <ScrollArea className={`pb-2 overflow-x-auto ${!editName ? "hidden" : "block"}`}>
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
              <p>Ehhez a csoporthoz még nem tartoznak oktatók.</p>
            ) : (
              <LoaderCircle className='animate-spin' />
            )}
            <Button variant="ghost" size="icon" className="group-hover:opacity-100 opacity-0"
            onClick={() => setEditTeachers((o) => !o)} type="button">
              <Edit />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2 py-4 group">
          <h3 className='font-bold'>Kurzusok</h3>
          <div className="flex gap-2">
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
              <LoaderCircle className='animate-spin' />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <h3 className='font-bold'>Tanulók</h3>
        {students?.length > 0 ? (
          <DataTable className="-mt-4" columns={studentColumns} data={group.enroled} />
        ) : students ? (
          <p>Ehhez a csoporthoz még nem tartoznak kurzusok</p>
        ) : (
          <LoaderCircle className='animate-spin' />
        )}
      </div>
    </form>
  )
}