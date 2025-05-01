import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";
import { Combobox } from "./ComboBox";
import { toast } from "sonner";
import { getAll } from "@/lib/api/api";
import { useAuth } from "@/lib/api/AuthProvider";

export function CreateEnrolment({
  enrolment,
  handleAddStudent
}) {
  const auth = useAuth()
  const [allStudents, setAllStudents] = useState(null)
  const [allSubjects, setAllSubjects] = useState(null)
  
  function handleCreateEnrolment(e) {
    const formData = new FormData(e.target);
    const enr = {
      student: formData.get("student") || undefined,
      subject: formData.get("subject") || undefined,
      price: +formData.get("price") || undefined
    }
    if (Object.values(enr).some(e => e == undefined)) return toast.error("Valamelyik mező üres!")
    handleAddStudent(enr)
  }

  function onOpenChange(e, what, endpoint) {
    if (!e || what != null) return
    if (endpoint == "student") getAll(auth.token, endpoint).then(resp => setAllStudents(resp.data.students))
    else if (endpoint == "subject") getAll(auth.token, endpoint).then(resp => setAllSubjects(resp.data.subjects))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Hozzáadás <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleCreateEnrolment}>
          <DialogHeader>
            <DialogTitle>Csoporthoz adás</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student" className="text-right">
                Diák
              </Label>
              <Combobox
                data={allStudents || []}
                displayName={"name"}
                name={"student"}
                onOpenChange={(e) => onOpenChange(e, allStudents, "student")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Kurzus
              </Label>
              <Combobox
                data={allSubjects || []}
                displayName={"name"}
                name={"subject"}
                onOpenChange={(e) => onOpenChange(e, allSubjects, "subject")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Ár
              </Label>
              <Input
                id="price"
                defaultValue={enrolment.price || ""}
                className="col-span-3"
                name={"price"}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Mégse</Button>
            </DialogClose>
            <Button type="submit">Hozzáadás</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
