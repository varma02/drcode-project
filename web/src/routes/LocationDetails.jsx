import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { get } from "@/lib/api/api"
import { useAuth } from "@/lib/api/AuthProvider"
import { Edit, LoaderCircle, Save } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

export default function LocationDetails() {
  const auth = useAuth()
  const params = useParams()

  const [location, setLocation] = useState(null)

  useEffect(() => {
    get(auth.token, 'location', ["location:" + params.id]).then(data => setLocation(data.data.locations[0]))
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
    const locationData = {
      id: "location:" + params.id,
      name: data.get("locationName"),
      address: data.get("locationAddress"),
      contact_email: data.get("locationEmail"),
      contact_phone: data.get("locationPhone"),
    };
    console.log("AAAA: ", locationData)
    updateLocation(auth.token, locationData)
    .then((v) => {
      setLocation((o) => ({...o, ...v.data.location}));
      toast.success("Helyszín mentve");
    }).catch(() => toast.error("Hiba történt mentés közben!"))
    .finally(() => setSaveLoading(false))
    setSaveLoading(false)
  }

  console.log(location)

  const [editName, setEditName] = useState(false)
  if (!location) return (
    <div className='h-screen w-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin ' />
    </div>
  )

  return (
    <form className='max-w-screen-xl md:w-full mx-auto p-4' onChange={handleChange} onSubmit={handleSave}>
      <div className="group flex gap-2 my-4">
        <Input defaultValue={location.name} type="text" name="locationName"
        placeholder="tanuló neve" className={editName ? "w-max" : "hidden"}/>
        <h1 className={editName ? "hidden" : "text-4xl"}>{location.name}</h1>
        <Button variant="ghost" size="icon" className="group-hover:opacity-100 opacity-0"
        onClick={() => setEditName((o) => !o)} type="button">
          <Edit />
        </Button>

        <Button size="icon" className="ml-auto" type="submit" disabled={saveLoading}>
          {saveLoading ? <LoaderCircle className="animate-spin" /> : <Save />}
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className='font-bold'>Kontakt</h3>
        <div className="flex gap-2">
          <Input defaultValue={location.address} placeholder="nincs megadva" type="text" name="locationAddress" />
          <Input defaultValue={location.contact_email} placeholder="nincs megadva" type="email" name="locationEmail" />
          <Input defaultValue={location.contact_phone} placeholder="nincs megadva" type="tel" name="locationPhone" />
        </div>
      </div>
    </form>
  )
}