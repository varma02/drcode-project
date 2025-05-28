import { CreateEnrolment } from "@/components/CreateEnrolment"
import DataTable from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { create, get, update } from "@/lib/api/api"
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

  useEffect(() => {
    get(auth.token, 'student', ["student:" + params.id], "enroled.out,enroled.subject", "enroled")
      .then(data => {setStudent(data.data.students[0])})
  }, [auth.token, params.id])

  const [saveTimer, setSaveTimer] = useState(0);
  function handleChange(e) {
    // if (saveTimer == 0) {
    //   const interval = setInterval(() => {
    //     setSaveTimer((o) => {
    //       if (o >= 50) {
    //         clearInterval(interval);
    //         handleSave({preventDefault: e.preventDefault, target: e.target.form});
    //         return 0;
    //       } else {
    //         return o + 1;
    //       }
    //     })
    //   }, 50);
    // }
    // setSaveTimer(1);
  }

  
  const [saveLoading, setSaveLoading] = useState(false);
  function handleSave(e) {
    e.preventDefault();
    if (saveLoading) return;
    setSaveLoading(true);
    const data = new FormData(e.target);
    const studentData = {
      name: data.get("studentName") == student.name ? undefined : data.get("studentName"),
      grade: +data.get("studentGrade") == 0 || data.get("studentGrade") == student.grade ? undefined : +data.get("studentGrade"),
      email: data.get("studentEmail") == student.email || !student.email ? undefined : data.get("studentGrade"),
      phone: data.get("studentPhone") == student.phone || !student.phone ? undefined : data.get("studentPhone"),
      parent: {
        name:  data.get("parentName") == "" || data.get("parentName") == student.parent?.name ? undefined : data.get("parentName"),
        email:  data.get("parentEmail") == "" || data.get("parentEmail") == student.parent?.email ? undefined : data.get("parentEmail"),
        phone:  data.get("parentPhone") == "" || data.get("parentPhone") == student.parent?.phone ? undefined : data.get("parentPhone"),
      },
    };
    if (Object.values(studentData.parent).every(v => !v)) delete studentData.parent
    if (Object.values(studentData).every(v => !v)) {
      setSaveLoading(false)
      return toast.message("Nincs változott adat.")
    }
    update(auth.token, "student", "student:" + params.id, studentData)
    .then((v) => {
      setStudent((o) => ({...o, ...v.data.student}));
      toast.success("Tanuló mentve");
    }).catch(() => toast.error("Hiba történt mentés közben!"))
    .finally(() => setSaveLoading(false))
  }

  function handleAddEnrolment(enr) {
    create(auth.token, "enrolment", enr)
      .then(
        () => {
          get(auth.token, 'student', ["student:" + params.id], "enroled.out,enroled.subject", "enroled")
            .then(data => {setStudent(data.data.students[0])})
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

  const [editName, setEditName] = useState(false);

  if (!student) return (
    <div className='h-screen w-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin ' />
    </div>
  )

  const columns = [
    {
      displayName: "Csoport neve",
      accessorKey: "out",
      cell: ({ row }) => row.getValue("out").name || "n/a",
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
      cell: ({ row }) => row.getValue("subject").name || "n/a",
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
      displayName: "Beiratkozás",
      header: "Beiratkozás",
      accessorKey: "created",
      cell: ({ row }) => (
        <div className="capitalize text-center">{format(new Date(row.getValue("created")), "PPP", {locale: hu} )}</div>
      ),
    },
  ]

  return (
    <div className='max-w-screen-xl md:w-full mx-auto p-4'>
      <form onChange={handleChange} onSubmit={handleSave}>
        <div className="group flex gap-2 my-4 items-center">
          <Input defaultValue={student.name} name="studentName" className={`w-max !text-4xl ${!editName ? "border-transparent" : ""} h-max disabled:opacity-100 !cursor-text transition-colors`} />
          {/* <h1 className={editName ? "hidden" : "text-4xl"}>{student.name}</h1> */}
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
      </form>

      <div className="flex flex-col gap-2 py-4">
        <h3 className='font-bold'>Csoportok</h3>
        {student.enroled.length > 0 ? (
          <DataTable data={student.enroled} columns={columns}
          headerAfter={<CreateEnrolment defaultStudentId={"student:"+params.id} handleAddEnrolment={handleAddEnrolment} disableFields={["student"]} />}
          className="-mt-14" />
        ) : (
          <p>Ez a tanuló még nem tagja egy csoportnak sem</p>
        )}
      </div>
    </div>
  )
}