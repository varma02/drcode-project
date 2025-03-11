import { TimePicker } from "@/components/TimePicker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getAllEmployees, getAllGroups, getAllLocations, getEmployee, getLesson, getLocation, getSubject, updateLesson, updateLocation, updateSubject } from "@/lib/api/api"
import { useAuth } from "@/lib/api/AuthProvider"
import { Edit, LoaderCircle, Save, SquareArrowOutUpRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"

export default function SubjectDetails() {
  const auth = useAuth()
  const params = useParams()

  const [subject, setSubject] = useState(null)

  useEffect(() => {
    getSubject(auth.token, "subject:" + params.id).then(data => setSubject(data.data.subjects[0]))
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
    const subjectData = {
      id: "subject:" + params.id,
      name: data.get("subjectName"),
      notes: data.get("notes"),
    };
    console.log("AAAA: ", subjectData)
    updateSubject(auth.token, subjectData)
    .then((v) => {
      setLocation((o) => ({...o, ...v.data.location}));
      toast.success("Kurzus mentve");
    }).catch(() => toast.error("Hiba történt mentés közben!"))
    .finally(() => setSaveLoading(false))
    setSaveLoading(false)
  }

  console.log(subject)

  const [editName, setEditName] = useState(false)
  if (!subject) return (
    <div className='h-screen w-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin ' />
    </div>
  )

  return (
    <form className='max-w-screen-xl md:w-full mx-auto p-4' onChange={handleChange} onSubmit={handleSave}>
      <div className="group flex gap-2 my-4">
        <Input defaultValue={subject.name} type="text" name="subjectName"
        placeholder="tanuló neve" className={editName ? "w-max" : "hidden"}/>
        <h1 className={editName ? "hidden" : "text-4xl"}>{subject.name}</h1>
        <Button variant="ghost" size="icon" className="group-hover:opacity-100 opacity-0"
        onClick={() => setEditName((o) => !o)} type="button">
          <Edit />
        </Button>

        <Button size="icon" className="ml-auto" type="submit" disabled={saveLoading}>
          {saveLoading ? <LoaderCircle className="animate-spin" /> : <Save />}
        </Button>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <h3 className='font-bold'>Leírás</h3>
        <Textarea placeholder="Lorem ipsum dolor..." className="h-20 max-h-48" defaultValue={subject.notes} name="notes" />
      </div>
    </form>
  )
}