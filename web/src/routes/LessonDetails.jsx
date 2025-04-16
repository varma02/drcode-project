import { TimePicker } from "@/components/TimePicker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { get, getAll, update } from "@/lib/api/api"
import { useAuth } from "@/lib/api/AuthProvider"
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

  useEffect(() => {
    get(auth.token, 'lesson', ["lesson:" + params.id], "group,group.teachers,group.location", "enroled").then(data => setLesson(data.data.lessons[0]))
    getAll(auth.token, 'employee').then(resp => setAllTeachers(resp.data.employees))
    getAll(auth.token, 'location').then(resp => setAllLocations(resp.data.locations))
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
      id: "lesson:" + params.id,
      name: data.get("lessonName"),
      start: data.get("lessonStart"),
      end: data.get("lessonEnd"),
      // location: data.get("lessonLocation"),
      // teachers: data.get("lessonTeachers").split(","),
      // group: data.get("lessonGroup"),
    };
    console.log("AAAA: ", lessonData)
    update(auth.token, "lesson", lessonData)
    .then((v) => {
      setLesson((o) => ({...o, ...v.data.lesson}));
      toast.success("Óra mentve");
    }).catch(() => toast.error("Hiba történt mentés közben!"))
    .finally(() => setSaveLoading(false))
    setSaveLoading(false)
  }

  const [editName, setEditName] = useState(false)
  if (!lesson) return (
    <div className='h-screen w-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin ' />
    </div>
  )

  return (
    <form className='max-w-screen-xl md:w-full mx-auto p-4' onChange={handleChange} onSubmit={handleSave}>
      <div className="group flex gap-2 my-4">
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
        {/* <GroupComboBox data={allTeachers} title={"Oktatók"} name={"lessonTeachers"} displayName={"name"} defaultValue={teachers} /> */}
        <div className="flex gap-2">
          {
            lesson.group.teachers.map(e => 
              <Link to={`/employee/${e.id.replace("employee:", "")}`} key={e}>
                <Button variant='outline' className='flex items-center gap-2'>
                  {e.name} <SquareArrowOutUpRight />
                </Button>
              </Link>
            )
          }
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
          {/* <Combobox data={allLocations} name={"lessonLocation"} displayName={"name"} value={location} setValue={setLocation} /> */}
          
          <Link to={`/locations/${lesson.group.location.id.replace("location:", "")}`} key={lesson.group.location.id}>
            <Button variant='outline' className='flex items-center gap-2'>
              {lesson.group.location.name} <SquareArrowOutUpRight />
            </Button>
          </Link>
        
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
        <h3 className='font-bold'>Csoport</h3>
        <Link to={`/groups/${lesson.group.id.replace("group:", "")}`} key={lesson.group.id}>
          <Button variant='outline' className='flex items-center gap-2'>
            {lesson.group.name} <SquareArrowOutUpRight />
          </Button>
        </Link>
      </div>
    </form>
  )
}