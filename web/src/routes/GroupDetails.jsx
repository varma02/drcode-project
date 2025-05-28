import AreYouSureAlert from "@/components/AreYouSureAlert"
import { Combobox } from "@/components/ComboBox"
import { CreateEnrolment } from "@/components/CreateEnrolment"
import DataTable from "@/components/DataTable"
import { MultiSelect } from "@/components/MultiSelect"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { create, get, getAll, remove, update } from "@/lib/api/api"
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

  const [tableData, setTableData] = useState([])
  const [rowSelection, setRowSelection] = useState({})

  const [group, setGroup] = useState(null)
  const [allTeachers, setAllTeachers] = useState(null)
  const [allLocations, setAllLocations] = useState(null)

  const [editName, setEditName] = useState(false)
  const [editTeachers, setEditTeachers] = useState(false)
  const [editLocation, setEditLocation] = useState(false)

  useEffect(() => {
    get(auth.token, 'group', ["group:" + params.id], "location,lessons,subjects,teachers,enroled.in,enroled.subject", "lessons,subjects,enroled")
      .then(data => {
        const g = data.data.groups[0]
        setGroup(g)
        setTableData(g.enroled)
      });
  }, [auth.token, params.id])

  useEffect(() => {
    if (!editTeachers || allTeachers) return
    getAll(auth.token, 'employee').then(resp => setAllTeachers(resp.data.employees))
  }, [editTeachers])

  useEffect(() => {
    if (!editLocation || allLocations) return
    getAll(auth.token, 'location').then(resp => setAllLocations(resp.data.locations))
  }, [editLocation])

  function handleAddStudent(data) {
    create(auth.token, "enrolment", data)
      .then(
        () => {
          get(auth.token, 'group', ["group:" + params.id], "location,lessons,subjects,teachers,enroled.in,enroled.subject", "lessons,subjects,enroled")
            .then(data => {setGroup(data.data.groups[0])});
          toast.success("Sikeres hozzáadás")
        },
        (error) => {
          switch (error.response?.data?.code) {
            case "bad_request":
              return toast.error("Valamelyik mező helytelen!")
            case "unauthorized":
              return toast.error("Ehhez hincs jogosultsága!")
            default:
              return toast.error("Ismeretlen hiba történt!")
          }
        }
      )
  }

  function handleDeleteStudent(e) {
    e.preventDefault()
    const ids = Object.keys(rowSelection).map(e => group.enroled[+e].id)
    remove(auth.token, "enrolment", ids).then(resp => {
      setTableData(p => p.filter(e => !ids.includes(e.id)))
      setRowSelection({})
    })
  }
  
  const [saveTimer, setSaveTimer] = useState(0)
  function handleChange(e) {
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
    if (saveLoading || !e.target) return;
    setSaveLoading(true);
    const data = new FormData(e.target);
    console.log(data.get("groupName"), group.name)
    const groupData = {
      name: data.get("groupName") == group.name ? undefined : data.get("groupName"),
      location: data.get("groupLocation") == group.location.id ? undefined : data.get("groupLocation"),
      teachers: data.get("groupTeachers") == group.teachers.map(t => t.id).join(",") ? undefined : data.get("groupTeachers").split(",")
    };
    console.log(groupData)
    if (Object.values(groupData).every(v => !v)) {
      setSaveLoading(false)
      return toast.message("Nincs változott adat.")
    }

    update(auth.token, "group", "group:" + params.id, groupData)
    .then((v) => {
      toast.success("Csoport mentve");
    }, (error) => { 
      switch (error.response?.data?.code) {
        case "fields_required":
          return toast.error("Valamelyik mező üres!")
        case "unauthorized":
          return toast.error("Ehhez hincs jogosultsága!")
        default:
          return toast.error("Ismeretlen hiba történt!")
      }
    })
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
      cell: ({ row }) => row.original.in.name,
    },
    {
      id: "grade",
      displayName: "Évfolyam",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => row.original.in.grade || "n/a",
      
    },
    {
      id: "subject",
      displayName: "Kurzus",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => row.original.subject.name || "n/a",
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
      <form onChange={handleChange} onSubmit={(e) => handleSave(e)}>
        <div className="flex gap-2 group items-center">
          <Input defaultValue={group.name} name="groupName" className={`w-max !text-4xl ${!editName ? "border-transparent" : ""} h-max disabled:opacity-100 !cursor-text transition-colors`} />
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
              <MultiSelect 
                options={convertToMultiSelectData(allTeachers || [])} 
                defaultValue={[...group.teachers?.map(e => e.id)]} 
                name="groupTeachers" className={`${!editTeachers ? "hidden" : "block"}`} />
              {group.teachers?.length > 0 ? (
                <ScrollArea className={`pb-2 overflow-x-auto ${editTeachers ? "hidden" : "block"}`}>
                  <div className='flex w-max gap-4 pb-1'>
                    {group.teachers.map(teacher => (
                      <Link to={`/employees/${teacher.id.replace("employee:", "")}`} key={teacher.id}>
                        <Button variant='outline' className='flex items-center gap-2'>
                          {teacher.name} <SquareArrowOutUpRight />
                        </Button>
                      </Link>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              ) : (
                <p>Ehhez a csoporthoz még nem tartoznak oktatók.</p>
              )}
              <Button variant="ghost" size="icon" className="group-hover:opacity-100 opacity-0"
              onClick={() => setEditTeachers((o) => !o)} type="button">
                <Edit />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 py-4 group">
            <h3 className='font-bold'>Helyszín</h3>
            <div className="flex gap-2">
              <Combobox 
                data={allLocations || []}
                displayName={"name"}
                defaultValue={group.location.id} 
                name="groupLocation" className={`${!editLocation ? "hidden" : "flex"}`} />
              {group.location ? (
                <ScrollArea className={`pb-2 overflow-x-auto ${editLocation ? "hidden" : "block"}`}>
                  <div className='flex w-max gap-4 pb-1'>
                    <Link to={`/location/${group.location.id.replace("location:", "")}`} key={group.location.id}>
                      <Button variant='outline' className='flex items-center gap-2'>
                        {group.location.name} <SquareArrowOutUpRight />
                      </Button>
                    </Link>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              ) : (
                <p>Ehhez a csoporthoz még nem tartozik helyszín.</p>
              )}
              <Button variant="ghost" size="icon" className="group-hover:opacity-100 opacity-0"
              onClick={() => setEditLocation((o) => !o)} type="button">
                <Edit />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 py-4 group">
            <h3 className='font-bold'>Kurzusok</h3>
            <div className="flex gap-2">
              {group.subjects?.length > 0 ? (
                <ScrollArea className='pb-2 overflow-x-auto'>
                  <div className='flex w-max gap-4 pb-1'>
                    {group.subjects.map(subject => (
                      <Link to={`/subjects/${subject.id.replace("subject:", "")}`} key={subject.id}>
                        <Button variant='outline' className='flex items-center gap-2'>
                          {subject.name} <SquareArrowOutUpRight />
                        </Button>
                      </Link>
                    ))} 
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              ) : (
                <p>Ehhez a csoporthoz még nem tartoznak kurzusok.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 py-4">
          <h3 className='font-bold'>Tanulók</h3>
        </div>
      </form>
      {group.enroled?.length > 0 ? (
        <DataTable 
          className="-mt-4" 
          columns={studentColumns} 
          data={tableData}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          headerAfter={
            <>
            <AreYouSureAlert onConfirm={handleDeleteStudent} disabled={Object.keys(rowSelection).length == 0} />
            <CreateEnrolment defaultGroupId={"group:"+params.id} disableFields={["group"]} handleAddEnrolment={handleAddStudent} />  
            </>
          } />
      ) : (
        <p>Ehhez a csoporthoz még nem tartoznak kurzusok</p>
      )}
    </div>
  )
}