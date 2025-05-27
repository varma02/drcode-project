import AreYouSureAlert from "@/components/AreYouSureAlert"
import { Combobox } from "@/components/ComboBox"
import DataTable from "@/components/DataTable"
import { DatePicker } from "@/components/DatePicker"
import { MultiSelect } from "@/components/MultiSelect"
import ReplacementDialog from "@/components/ReplacementDialog"
import { ToggleButton } from "@/components/ToggleButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { attendLesson, get, getAll, remove, update } from "@/lib/api/api"
import { useAuth } from "@/lib/api/AuthProvider"
import { convertToMultiSelectData } from "@/lib/utils"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { ArrowDown, ArrowUp, ArrowUpDown, Edit, LoaderCircle, Save, SquareArrowOutUpRight, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"

export default function LessonDetails() {
  const auth = useAuth()
  const params = useParams()

  const [lesson, setLesson] = useState(null)
  const [allTeachers, setAllTeachers] = useState(null)
  const [allLocations, setAllLocations] = useState(null)
  const [allGroups, setAllGroups] = useState(null)
  const [attended, setAttended] = useState([])
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    get(auth.token, 'lesson', ["lesson:" + params.id], "group,group.teachers,group.location,enroled.in,enroled.subject,replaced.in", "enroled,attended,replaced").then(data => {
      const less = data.data.lessons[0]
      setLesson(less)
      setAttended(less.attended.map(a => a.in))
      setTableData([...less.enroled, ...less.replaced])
    })
  }, [auth.token, params.id])

  const [saveTimer, setSaveTimer] = useState(0);
  function handleChange(e) {
    if (e.target.name == "") return
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

  const [saveLoading, setSaveLoading] = useState(false);
  function handleSave(e) {
    e.preventDefault();
    if (saveLoading || !e.target) return;
    setSaveLoading(true);
    const data = new FormData(e.target);
    const lessonData = {
      name: data.get("lessonName") == lesson.group.name || !data.get("lessonName") ? undefined : data.get("lessonName"),
      start: data.get("dateStart") == lesson.start ? undefined : data.get("dateStart"),
      end: data.get("dateEnd") == lesson.end ? undefined : data.get("dateEnd"),
      location: data.get("lessonLocation") == lesson.group.location.id ? undefined : data.get("lessonLocation"),
      teachers: data.get("lessonTeachers") == lesson.group.teachers.map(t => t.id).join(",") ? undefined : data.get("lessonTeachers").split(","),
      group: data.get("lessonGroup") == lesson.group.id ? undefined : data.get("lessonGroup"),
      attended: attended.join(",") == lesson.attended.map(a => a.in).join(",") ? undefined : attended,
    };

    if (Object.values(lessonData).every(v => !v)) {
      setSaveLoading(false)
      return toast.message("Nincs változott adat.")
    }

    update(auth.token, "lesson", "lesson:" + params.id, lessonData)
    .then((v) => {
      delete v.data.lesson.group
      setLesson((o) => ({...o, ...v.data.lesson}));
      if (lesson.attended != attended) attendLesson(auth.token, "lesson:"+params.id, attended)
      toast.success("Óra mentve");
    }).catch(() => toast.error("Hiba történt mentés közben!"))
    .finally(() => setSaveLoading(false))
    setSaveLoading(false)
  }

  const [editName, setEditName] = useState(false)
  const [editTeachers, setEditTeachers] = useState(false)
  const [editLocation, setEditLocation] = useState(false)
  const [editGroups, setEditGroups] = useState(false)

  
  function removeReplacement(e, id) {
    e.preventDefault()
    remove(auth.token, "replacement", [id])
    .then(resp => {
      setTableData(p => p.filter(s => s.id != id))
      toast.success("Pótlás sikeresen törölve")
    }, (error) => {
      switch (error.response?.data?.code) {
        case "unauthorized":
          return toast.error("Ehhez hincs jogosultsága!");
          default:
            return toast.error("Ismeretlen hiba történt!");
      }})
    }
      
  if (!lesson) return (
    <div className='h-screen w-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin ' />
    </div>
  )
  
  
  console.log(tableData)
  
  const columns = [
    {
      displayName: "Diák neve",
      accessorKey: "name",
      cell: ({ row }) => row.getValue("in").name,
      header: ({ column }) => {
        return (
          <Button
            type="button"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {column.columnDef.displayName}
            {!column.getIsSorted() ? <ArrowUpDown /> 
            : column.getIsSorted() === "asc" ? <ArrowDown /> : <ArrowUp />}
          </Button>
        )
      },
    },
    {
      displayName: "Évfolyam",
      accessorKey: "in",
      cell: ({ row }) => row.getValue("in").grade,
      header: ({ column }) => {
        return (
          <Button
            type="button"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {column.columnDef.displayName}
            {!column.getIsSorted() ? <ArrowUpDown /> 
            : column.getIsSorted() === "asc" ? <ArrowDown /> : <ArrowUp />}
          </Button>
        )
      },
    },
    {
      displayName: "Tanult tárgy",
      accessorKey: "subject",
      cell: ({ row }) => row.getValue("subject")?.name || "",
      header: ({ column }) => {
        return (
          <Button
            type="button"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {column.columnDef.displayName}
            {!column.getIsSorted() ? <ArrowUpDown /> 
            : column.getIsSorted() === "asc" ? <ArrowDown /> : <ArrowUp />}
          </Button>
        )
      },
    },
    {
      displayName: "Ár",
      header: "Ár",
      accessorKey: "price",
    },
    {
      displayName: "Létrehozás",
      header: "Létrehozás",
      accessorKey: "created",
      cell: ({ row }) => (
        <div className="capitalize text-center">{format(new Date(row.getValue("created")), "PPP", {locale: hu} )}</div>
      ),
    },
    {
      displayName: "Jelenlét",
      accessorKey: "status",
      header: "Jelenlét",
      cell: ({ row }) => (
        row.original.extension ? 
        <div className="flex justify-center items-center gap-2">
          <p className="w-full rounded-full px-2 py-0.5 text-center bg-blue-500">Pótol</p>
          <AreYouSureAlert trigger={<Trash className="cursor-pointer" />} onConfirm={e => removeReplacement(e, row.original.id)} />
        </div>
        :
        <ToggleButton onText={"Jelen"} offText={"Hiányzik"} value={attended.includes(row.original.in.id)} onch={(e) => {
          if (!e) setAttended(p => [...p, row.original.in.id])
          else setAttended(p => p.filter(v => v != row.original.in.id))
      }} />
      )
    },
  ]

  return (
    <div className='max-w-screen-xl md:w-full mx-auto p-4'>
      <form onChange={handleChange} onSubmit={handleSave}>
        <div className="group flex gap-2 my-4 items-center">
          <Input defaultValue={lesson.group.name} type="text" name="lessonName"
          placeholder="tanuló neve" className={`w-max !text-4xl ${!editName ? "border-transparent" : ""} h-max disabled:opacity-100 !cursor-text transition-colors`} disabled={!editName} />
          <Button variant="ghost" size="icon" className="group-hover:opacity-100 opacity-0"
          onClick={() => setEditName((o) => !o)} type="button">
            <Edit />
          </Button>
          <Button size="icon" className="ml-auto" type="submit" disabled={saveLoading}>
            {saveLoading ? <LoaderCircle className="animate-spin" /> : <Save />}
          </Button>
        </div>
        <div className="flex gap-4 py-4">
          <div className="flex flex-col gap-2">
            <h3 className='font-bold'>Oktatók</h3>
            <div className="flex gap-2 group">
              <MultiSelect
                name={"lessonTeachers"}
                options={convertToMultiSelectData(allTeachers || [], "name")}
                defaultValue={lesson.group?.teachers.map(e => e.id)}
                className={`${editTeachers ? "block" : "hidden"}`} />
              {
                lesson.group.teachers.map(e =>
                  <Link to={`/employee/${e.id.replace("employee:", "")}`} key={e.id} className={`${!editTeachers ? "block" : "hidden"}`} >
                    <Button variant='outline' className='flex items-center gap-2'>
                      {e.name} <SquareArrowOutUpRight />
                    </Button>
                  </Link>
                )
              }
              <Button variant="ghost" size="icon" className="group-hover:opacity-100 opacity-0"
              onClick={() => setEditTeachers((o) => {!o && !allTeachers && getAll(auth.token, "employee").then(resp => setAllTeachers(resp.data.employees)); return !o})} type="button">
                <Edit />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className='font-bold'>Csoport</h3>
            <div className="flex gap-4 items-center group">
              <Combobox
                data={allGroups || []}
                name={"lessonGroup"}
                displayName={"name"}
                defaultValue={lesson.group.id}
                className={`${editGroups ? "flex" : "hidden"}`} />
              <Link to={`/groups/${lesson.group.id.replace("group:", "")}`} key={lesson.group.id} className={`${!editGroups ? "block" : "hidden"}`}>
                <Button variant='outline' className='flex items-center gap-2'>
                  {lesson.group.name} <SquareArrowOutUpRight />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="group-hover:opacity-100 opacity-0"
              onClick={() => setEditGroups((o) => {!o && !allGroups && getAll(auth.token, "group").then(resp => setAllGroups(resp.data.groups)); return !o})} type="button">
                <Edit />
              </Button>
            </div>
          </div>
          <div>
            <h3 className='font-bold mb-2'>Helyszín</h3>
            <div className="flex gap-4 items-center group">
              <Combobox
                data={allLocations || []}
                name={"lessonLocation"}
                displayName={"name"}
                defaultValue={lesson.group.location.id}
                className={`${editLocation ? "flex" : "hidden"}`} />
              <Link to={`/locations/${lesson.group.location.id.replace("location:", "")}`} key={lesson.group.location.id} className={`${!editLocation ? "block" : "hidden"}`} >
                <Button variant='outline' className='flex items-center gap-2'>
                  {lesson.group.location.name} <SquareArrowOutUpRight />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="group-hover:opacity-100 opacity-0"
              onClick={() => setEditLocation((o) => {!o && !allLocations && getAll(auth.token, "location").then(resp => setAllLocations(resp.data.locations)); return !o})} type="button">
                <Edit />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-12 items-end mb-2">
          <div>
            <h3 className='font-bold mb-2'>Kezdés</h3>
            <DatePicker date={new Date(lesson.start)} includeTime showTimePicker dateFormat="PPPp" name={"dateStart"} />
          </div>
          <div>
            <h3 className='font-bold mb-2'>Befejezés</h3>
            <DatePicker date={new Date(lesson.end)} includeTime showTimePicker dateFormat="PPPp" name={"dateEnd"} />
          </div>
        </div>
      </form>
      <DataTable data={tableData} columns={columns} hideColumns={["created", "price"]} headerAfter={<ReplacementDialog originalLessonId={lesson.id} />} />
    </div>
  )
}