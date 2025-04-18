import AreYouSureAlert from "@/components/AreYouSureAlert"
import DataTable from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { get } from "@/lib/api/api"
import { useAuth } from "@/lib/api/AuthProvider"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { ArrowDown, ArrowUp, ArrowUpDown, Edit, LoaderCircle, Save } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

export default function StudentDetails() {
  const auth = useAuth()
  const params = useParams()

  const [student, setStudent] = useState(null)
  const [groups, setGroups] = useState(null)
  const [subjects, setSubjects] = useState(null)

  useEffect(() => {
    get(auth.token, 'student', ["student:" + params.id], null, "enroled")
    .then(data => setStudent(data.data.students[0]))
  }, [auth.token, params.id]);

  useEffect(() => {
    if (!student) return;

    const gids = new Set()
    student.enroled?.forEach(s => gids.add(s.out))
    if (gids.size !== 0)
      get(auth.token, 'group', Array.from(gids))
      .then(data => setGroups(data.data.groups))
    else
      setGroups([])

    const stids = new Set()
    student.enroled?.forEach(s => stids.add(s.subject))
    if (stids.size !== 0)
      get(auth.token, 'subject', Array.from(stids))
      .then(data => setSubjects(data.data.subjects))
    else
      setSubjects([])
  }, [student]);

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
    const studentData = {
      id: "student:" + params.id,
      name: data.get("studentName"),
      grade: data.get("studentGrade"),
      email: data.get("studentEmail"),
      phone: data.get("studentPhone"),
      parent: {
        name: data.get("parentName"),
        email: data.get("parentEmail"),
        phone: data.get("parentPhone"),
      },
    };
    updateStudent(auth.token, studentData)
    .then((v) => {
      setStudent((o) => ({...o, ...v.data.student}));
      toast.success("Tanuló mentve");
    }).catch(() => toast.error("Hiba történt mentés közben!"))
    .finally(() => setSaveLoading(false))
  }

  const [editName, setEditName] = useState(false);

  if (!student) return (
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
        <Input defaultValue={student.name} type="text" name="studentName"
        placeholder="tanuló neve" className={editName ? "w-max" : "hidden"}/>
        <h1 className={editName ? "hidden" : "text-4xl"}>{student.name}</h1>
        <Button variant="ghost" size="icon" className="group-hover:opacity-100 opacity-0"
        onClick={() => setEditName((o) => !o)} type="button">
          <Edit />
        </Button>

        <Button size="icon" className="ml-auto" type="submit" disabled={saveLoading}>
          {saveLoading ? <LoaderCircle className="animate-spin" /> : <Save />}
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-12 py-4">
        <div>
          <h3 className='font-bold'>Évfolyam</h3>
          <Input defaultValue={student.grade} placeholder="nincs megadva" type="number" name="studentGrade" />
        </div>
        <div>
          <h3 className='font-bold'>E-mail cím</h3>
          <Input defaultValue={student.email} placeholder="nincs megadva" type="email" name="studentEmail" />
        </div>
        <div>
          <h3 className='font-bold'>Telefonszám</h3>
          <Input defaultValue={student.phone} placeholder="nincs megadva" type="text" name="studentPhone" />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-12 py-4">
        <div>
          <h3 className='font-bold'>Szülő neve</h3>
          <Input defaultValue={student.parent?.name} placeholder="nincs megadva" type="text" name="parentName" />
        </div>
        <div>
          <h3 className='font-bold'>Szülő E-mail címe</h3>
          <Input defaultValue={student.parent?.email} placeholder="nincs megadva" type="email" name="parentEmail" />
        </div>
        <div>
          <h3 className='font-bold'>Szülő Telefonszáma</h3>
          <Input defaultValue={student.parent?.phone} placeholder="nincs megadva" type="text" name="parentPhone" />
        </div>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <h3 className='font-bold'>Megjegyzés</h3>
        <Textarea placeholder="Lorem ipsum dolor..." className="h-20 max-h-48" defaultValue={student.notes} name="notes" />
      </div>

      <div className="flex flex-col gap-2 py-4">
        <h3 className='font-bold'>Csoportok</h3>
        {student.enroled.length > 0 ? (
          <DataTable data={student.enroled} columns={columns}
          className="-mt-14"
          headerAfter={<div className='flex gap-4 pl-4'>
            <AreYouSureAlert />
          </div>} />
        ) : (
          <p>Ez a tanuló még nem tagja egy csoportnak sem</p>
        )}
      </div>
    </form>
  )
}