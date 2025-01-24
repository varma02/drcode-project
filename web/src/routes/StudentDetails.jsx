import DataTable from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { getEmployeeWithDetails, getGroup, getGroupWithDetails, getStudent, getSubject } from "@/lib/api/api"
import { useAuth } from "@/lib/api/AuthProvider"
import { format } from "date-fns"
import { hu, id } from "date-fns/locale"
import { ArrowDown, ArrowUp, ArrowUpDown, LoaderCircle, SquareArrowOutUpRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"

export default function StudentDetails() {
  const auth = useAuth()
  const params = useParams()

  const [student, setStudent] = useState(null)
  const [groups, setGroups] = useState(null)
  // const [students, setStudents] = useState(null)

  useEffect(() => {
    getStudent(auth.token, "student:" + params.id)
    .then(data => setStudent(data.data.students[0]))
  }, [auth.token, params.id]);

  // useEffect(() => {
  //   if (!student) return;

  //   const sids = new Set()
  //   student.groups?.forEach(s => sids.add(s))
  //   if (sids.size !== 0)
  //     getGroup(auth.token, Array.from(sids))
  //     .then(data => setGroups(data.data.groups))
  //   else
  //     setGroups([])

  //   const stids = new Set()
  //   employee.enroled?.forEach(s => stids.add(s.in))
  //   if (stids.size !== 0)
  //     getStudent(auth.token, Array.from(stids))
  //     .then(data => setStudents(data.data.students))
  //   else
  //     setStudents([])
  // }, [student]);

  if (!student) return (
    <div className='h-screen w-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin ' />
    </div>
  )

  // {
  //   id: "student:123",
  //   name: "Scratch",
  //   grade: 5,
  //   email: "gyerok@example.com",
  //   phone: "+3612345678",
  //   parent: {
  //     name: "Parent",
  //     email: "parent@example.com",
  //     phone: "+3612345678"
  //   },
  //   notes: ""
  // }

  return (
    <div className='max-w-screen-xl md:w-full mx-auto p-4'>
      <h1 className='text-4xl pt-4'>{student.name}</h1>
      <h2 className='font-normal text-lg pb-4 text-foreground/70'>{student.email}</h2>
      
      <div className="flex gap-12 py-4">
        <div>
          <h3 className='font-bold'>Évfolyam</h3>
          <Input defaultValue={student.grade} placeholder="nincs megadva" type="number" />
        </div>
        <div>
          <h3 className='font-bold'>E-mail cím</h3>
          <Input defaultValue={student.email} placeholder="nincs megadva" type="email" />
        </div>
        <div>
          <h3 className='font-bold'>Telefonszám</h3>
          <Input defaultValue={student.phone} placeholder="nincs megadva" type="text" />
        </div>
      </div>
      
      <div className="flex gap-12 py-4">
        <div>
          <h3 className='font-bold'>Szülő neve</h3>
          <Input defaultValue={student.parent.name} placeholder="nincs megadva" type="text" />
        </div>
        <div>
          <h3 className='font-bold'>Szülő E-mail címe</h3>
          <Input defaultValue={student.parent.email} placeholder="nincs megadva" type="email" />
        </div>
        <div>
          <h3 className='font-bold'>Szülő Telefonszáma</h3>
          <Input defaultValue={student.parent.phone} placeholder="nincs megadva" type="text" />
        </div>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <h3 className='font-bold'>Megjegyzés</h3>
        <Textarea id="notes" placeholder="Lorem ipsum dolor..." className="h-20 max-h-48" defaultValue={student.notes} />
      </div>

      <div className="flex flex-col gap-2 py-4">
        <h3 className='font-bold'>Csoportok</h3>
        {groups?.length > 0 ? (
          <ScrollArea className='pb-2 overflow-x-auto'>
            <div className='flex w-max gap-4 pb-1'>
              {groups.map(group => (
                <Link to={`/groups/${group.id.replace("group:", "")}`} key={group.id}>
                  <Button variant='outline' className='flex items-center gap-2'>
                    {group.name} <SquareArrowOutUpRight />
                  </Button>
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : groups ? (
          <p>Ez az tanuló nem tagja egy csoportnak sem.</p>
        ) : (
          <LoaderCircle className='animate-spin ' />
        )}
      </div>
    </div>
  )
}