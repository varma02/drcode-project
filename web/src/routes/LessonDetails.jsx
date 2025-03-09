import { Combobox } from "@/components/ComboBox"
import { GroupComboBox } from "@/components/GroupComboBox"
import { TimePicker } from "@/components/TimePicker"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getAllEmployees, getAllGroups, getAllLocations, getEmployee, getGroup, getLesson } from "@/lib/api/api"
import { useAuth } from "@/lib/api/AuthProvider"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { ArrowDown, ArrowUp, ArrowUpDown, Edit, LoaderCircle, Save } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function LessonDetails() {
  const auth = useAuth()
  const params = useParams()

  const [lesson, setLesson] = useState(null)
  const [allGroups, setAllGroups] = useState([])
  const [teachers, setTeachers] = useState([])
  const [allTeachers, setAllTeachers] = useState([])
  const [location, setLocation] = useState([])
  const [allLocations, setAllLocations] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)

  useEffect(() => {
    getLesson(auth.token, "lesson:" + params.id).then(data => setLesson(data.data.lessons[0]))
    getAllEmployees(auth.token).then(resp => setAllTeachers(resp.data.employees))
    getAllLocations(auth.token).then(resp => setAllLocations(resp.data.locations))
  }, [auth.token, params.id]);

  useEffect(() => {
    if (!lesson) return;
    if (lesson.group) {
      getAllGroups(auth.token).then(data => setAllGroups(data.data.groups))
    }
    else setAllGroups([])

    if (lesson.teachers) getEmployee(auth.token, lesson.teachers).then(data => setTeachers(data.data.teachers))
    else setTeachers([])
  }, [lesson]);

  useEffect(() => {
    if (allGroups.length == 0) return
    // if (allGroups == undefined) return
    setSelectedGroup(allGroups.find(e => e.id == lesson.group).id)
    setLocation(allGroups.find(e => e.id == lesson.group).location)
  }, [allGroups])

  const [saveTimer, setSaveTimer] = useState(0);
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

  const [saveLoading, setSaveLoading] = useState(false);
  function handleSave(e) {
    e.preventDefault();
    if (saveLoading) return;
    setSaveLoading(true);
    const data = new FormData(e.target);
    const lessonData = {
      id: "lesson:" + params.id,
      name: data.get("lessonName"),
      start: data.get("lessonStart"),
      end: data.get("lessonEnd"),
      location: data.get("lessonLocation"),
      teachers: data.get("lessonTeachers").split(","),
      group: data.get("lessonGroup"),
      notes: data.get("notes"),
    };
    console.log("AAAA: ", lessonData)
    // updateLesson(auth.token, lessonData)
    // .then((v) => {
    //   setLesson((o) => ({...o, ...v.data.lesson}));
    //   toast.success("Óra mentve");
    // }).catch(() => toast.error("Hiba történt mentés közben!"))
    // .finally(() => setSaveLoading(false))
    setSaveLoading(false)
  }

  console.log(lesson)

  const [editName, setEditName] = useState(false)
  if (!lesson) return (
    <div className='h-screen w-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin ' />
    </div>
  )

  const columns = [
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
      displayName: "Csoport neve",
      accessorKey: "out",
      cell: ({ row }) => groups?.find(g => g.id === row.getValue("out"))?.name || "n/a",
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
      cell: ({ row }) => subjects?.find(s => s.id === row.getValue("subject"))?.name || "n/a",
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
      displayName: "Megjegyzés",
      header: "Megjegyzés",
      accessorKey: "notes",
    },
    {
      displayName: "Beiratkozás",
      header: "Beiratkozás",
      accessorKey: "created",
      cell: ({ row }) => (
        <div className="capitalize text-center">{format(new Date(row.getValue("created")), "PPP", {locale: hu} )}</div>
      ),
    },
  ]

  return (
    <form className='max-w-screen-xl md:w-full mx-auto p-4' onChange={handleChange} onSubmit={handleSave}>
      <div className="group flex gap-2 my-4">
        <Input defaultValue={allGroups.find(e => e.id == lesson.group)?.name} type="text" name="lessonName"
        placeholder="tanuló neve" className={editName ? "w-max" : "hidden"}/>
        <h1 className={editName ? "hidden" : "text-4xl"}>{allGroups.find(e => e.id == lesson.group)?.name}</h1>
        <Button variant="ghost" size="icon" className="group-hover:opacity-100 opacity-0"
        onClick={() => setEditName((o) => !o)} type="button">
          <Edit />
        </Button>

        <Button size="icon" className="ml-auto" type="submit" disabled={saveLoading}>
          {saveLoading ? <LoaderCircle className="animate-spin" /> : <Save />}
        </Button>
      </div>

      <GroupComboBox data={allTeachers} title={"Oktatók"} name={"lessonTeachers"} displayName={"name"} defaultValue={teachers} />
      
      <div className="flex flex-wrap gap-12 py-4">
        <div>
          <h3 className='font-bold'>Kezdés</h3>
          <TimePicker date={new Date(lesson.start)} name={"lessonStart"} />
        </div>
        <div>
          <h3 className='font-bold'>Befejezés</h3>
          <TimePicker date={new Date(lesson.end)} name={"lessonEnd"} />
        </div>
        <div>
          <h3 className='font-bold'>Helyszín</h3>
          <Combobox data={allLocations} name={"lessonLocation"} displayName={"name"} value={location} setValue={setLocation} />
          {/* <Input defaultValue={lesson.parent?.name} placeholder="nincs megadva" type="text" name="parentName" /> */}
        </div>
        <div>
          <h3 className='font-bold'>Szülő E-mail címe</h3>
          <Input defaultValue={lesson.parent?.email} placeholder="nincs megadva" type="email" name="parentEmail" />
        </div>
        <div>
          <h3 className='font-bold'>Szülő Telefonszáma</h3>
          <Input defaultValue={lesson.parent?.phone} placeholder="nincs megadva" type="text" name="parentPhone" />
        </div>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <h3 className='font-bold'>Megjegyzés</h3>
        <Textarea placeholder="Lorem ipsum dolor..." className="h-20 max-h-48" defaultValue={lesson.notes} name="notes" />
      </div>

      <div className="flex flex-col gap-2 py-4">
        <h3 className='font-bold'>Csoport</h3>
        <Combobox data={allGroups} value={selectedGroup} name={"lessonGroup"} displayName={"name"} setValue={setSelectedGroup} />
        {/* {student.enroled.length > 0 ? (
          <DataTable data={student.enroled} columns={columns}
          className="-mt-14"
          headerAfter={<div className='flex gap-4 pl-4'>
            <AreYouSureAlert />
          </div>} />
        ) : (
          <p>Ez a tanuló még nem tagja egy csoportnak sem</p>
        )} */}
      </div>
    </form>
  )
}