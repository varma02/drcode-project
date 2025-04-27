import { Combobox } from "@/components/ComboBox"
import { MultiSelect } from "@/components/MultiSelect"
import { TimePicker } from "@/components/TimePicker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { get, getAll, update } from "@/lib/api/api"
import { useAuth } from "@/lib/api/AuthProvider"
import { convertToMultiSelectData } from "@/lib/utils"
import { Edit, LoaderCircle, Save, SquareArrowOutUpRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"

export default function LessonDetails() {
  const auth = useAuth()
  const params = useParams()

  const [lesson, setLesson] = useState(null)
  const [allTeachers, setAllTeachers] = useState([])
  const [allLocations, setAllLocations] = useState([])
  const [allGroups, setAllGroups] = useState([])

  useEffect(() => {
    get(auth.token, 'lesson', ["lesson:" + params.id], "group,group.teachers,group.location", "enroled").then(data => setLesson(data.data.lessons[0]))
    getAll(auth.token, 'employee').then(resp => setAllTeachers(resp.data.employees))
    getAll(auth.token, 'location').then(resp => setAllLocations(resp.data.locations))
    getAll(auth.token, 'group').then(resp => setAllGroups(resp.data.groups))
  }, [auth.token, params.id])

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
      name: data.get("lessonName"),
      start: data.get("lessonStart"),
      end: data.get("lessonEnd"),
      location: data.get("lessonLocation"),
      teachers: data.get("lessonTeachers").split(","),
      group: data.get("lessonGroup"),
    };
    console.table(lessonData)
    update(auth.token, "lesson", "lesson:" + params.id, lessonData)
    .then((v) => {
      setLesson((o) => ({...o, ...v.data.lesson}));
      toast.success("Óra mentve");
    }).catch(() => toast.error("Hiba történt mentés közben!"))
    .finally(() => setSaveLoading(false))
    setSaveLoading(false)
  }

  const [editName, setEditName] = useState(false)
  const [editTeachers, setEditTeachers] = useState(false)
  const [editLocation, setEditLocation] = useState(false)
  const [editGroups, setEditGroups] = useState(false)
  if (!lesson) return (
    <div className='h-screen w-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin ' />
    </div>
  )

  console.log(lesson)
  return (
    <form className='max-w-screen-xl md:w-full mx-auto p-4' onChange={handleChange} onSubmit={handleSave}>
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

      <div className="flex flex-col gap-2">
        <h3 className='font-bold'>Oktatók</h3>
        <div className="flex gap-2 group">
          <MultiSelect 
            name={"lessonTeachers"} 
            options={convertToMultiSelectData(allTeachers, "name")} 
            defaultValue={lesson.group.teachers.map(e => e.id)} 
            className={`${editTeachers ? "block" : "hidden"}`} />
          {
            lesson.group.teachers.map(e => 
              <Link to={`/employee/${e.id.replace("employee:", "")}`} key={e} className={`${!editTeachers ? "block" : "hidden"}`} >
                <Button variant='outline' className='flex items-center gap-2'>
                  {e.name} <SquareArrowOutUpRight />
                </Button>
              </Link>
            )
          }
          <Button variant="ghost" size="icon" className="group-hover:opacity-100 opacity-0"
          onClick={() => setEditTeachers((o) => !o)} type="button">
            <Edit />
          </Button>
        </div>
      </div>
      
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
          <div className="flex gap-4 items-center group">
            <Combobox 
              data={allLocations} 
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
            onClick={() => setEditLocation((o) => !o)} type="button">
              <Edit />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <h3 className='font-bold'>Csoport</h3>
        <div className="flex gap-4 items-center group">
          <Combobox 
            data={allGroups} 
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
          onClick={() => setEditGroups((o) => !o)} type="button">
            <Edit />
          </Button>
        </div>
      </div>
    </form>
  )
}