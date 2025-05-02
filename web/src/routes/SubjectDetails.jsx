import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { get, update } from "@/lib/api/api"
import { useAuth } from "@/lib/api/AuthProvider"
import { Edit, LoaderCircle, Save } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

export default function SubjectDetails() {
  const auth = useAuth()
  const params = useParams()

  const [subject, setSubject] = useState(null)

  useEffect(() => {
    get(auth.token, 'subject', ["subject:" + params.id]).then(data => setSubject(data.data.subjects[0]))
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
      name: data.get("subjectName") || subject.name,
      description: data.get("description") || subject.description,
    };
    update(auth.token, "subject", "subject:" + params.id, subjectData)
    .then((v) => { toast.success("Kurzus mentve") })
    .catch((err) => toast.error("Hiba történt mentés közben!"))
    .finally(() => setSaveLoading(false))
    setSaveLoading(false)
  }

  const [editName, setEditName] = useState(false)
  if (!subject) return (
    <div className='h-screen w-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin ' />
    </div>
  )

  return (
    <form className='max-w-screen-xl md:w-full mx-auto p-4' onChange={handleChange} onSubmit={handleSave}>
      <div className="group flex gap-2 my-4 items-center">
        <Input defaultValue={subject.name} name="subjectName" className={`w-max !text-4xl ${!editName ? "border-transparent" : ""} h-max disabled:opacity-100 !cursor-text transition-colors`} disabled={!editName} />
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
        <Textarea placeholder="Lorem ipsum dolor..." className="h-20 max-h-48" defaultValue={subject.description} name="description" />
      </div>
    </form>
  )
}