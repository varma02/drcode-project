import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Clock, MapPin, User2, ArrowUp, ArrowDown, X, Coffee, Trash, TriangleAlert } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ToggleButton } from "@/components/ToggleButton";
import { useAuth } from "@/lib/api/AuthProvider";
import { attendLesson, get, getNextLesson, remove } from "@/lib/api/api";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import WorkInProgress from "@/components/WorkInProgress";
import { toast } from "sonner";
import { isAdmin, isTeacher } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import ReplacementDialog from "@/components/ReplacementDialog";
import AreYouSureAlert from "@/components/AreYouSureAlert";

export default function Home() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [nextLesson, setNextLesson] = useState(null);
  const [nextLessonStudents, setNextLessonStudents] = useState([]);
  const [attended, setAttended] = useState([]);

  useEffect(() => {
    // if (!isTeacher(auth.user.roles) && isAdmin(auth.user.roles)) navigate("/admin");
    getNextLesson(auth.token, "group,group.location", "enroled,attended,replaced").then(
      (resp) => {
        const nl = resp.data.lesson;
        setNextLesson(nl);
        setAttended(nl.attended.map(a => a.in));
        get(auth.token, "student", [...nl.enroled.map((e) => e.in)], undefined, "enroled").then((resp) => {
          const ls = resp.data.students
          setNextLessonStudents(ls)
          if (nl.replaced.length != 0)
            get(auth.token, "student", nl.replaced.map(e => e.in), undefined, "enroled").then((resp2) => 
              // console.log(resp2.data)
              setNextLessonStudents(p => [
                ...p, 
                ...resp2.data.students.map(student => ({
                  ...student,
                  replacement: nl.replaced.find(r => r.in == student.id).id
                }))
              ])
            );
        });
      },
      (error) => {
        switch (error.response?.data?.code) {
          case "not_found":
            return null;
          case "unauthorized":
            return toast.error("Ehhez hincs jogosultsága!");
          default:
            return toast.error("Ismeretlen hiba történt!");
        }
      }
    );
  }, [auth.token]);

  function endLesson() {
    attendLesson(auth.token, nextLesson.id, attended).then(() =>
      toast.success("Óra mentve"),
      (error) => {
          switch (error.response?.data?.code) {
            case "not_found":
              return null;
            case "unauthorized":
              return toast.error("Ehhez hincs jogosultsága!");
            default:
              return toast.error("Ismeretlen hiba történt!");
          }
        }
    );
  }

  function removeReplacement(e, id) {
    e.preventDefault()
    remove(auth.token, "replacement", [id])
      .then(resp => {
        setNextLessonStudents(p => p.filter(s => s.replacement != id))
        toast.success("Pótlás sikeresen törölve")
      }, (error) => {
        switch (error.response?.data?.code) {
          case "unauthorized":
            return toast.error("Ehhez hincs jogosultsága!");
          default:
            return toast.error("Ismeretlen hiba történt!");
        }
      })
  }

  if (!isTeacher(auth.user.roles)) return (
    <div className="size-full flex justify-center items-center">
      <p>Ezt az oldal csak oktatóknak van</p>
    </div>
  )

  const columns = [
    {
      displayName: "Név",
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {column.columnDef.displayName}
            {!column.getIsSorted() ? (
              <ArrowUpDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowDown />
            ) : (
              <ArrowUp />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "grade",
      displayName: "Évfolyam",
      header: ({ column }) => column.columnDef.displayName,
    },
    {
      accessorKey: "parent.name",
      displayName: "Szülő neve",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {column.columnDef.displayName}
            {!column.getIsSorted() ? (
              <ArrowUpDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowDown />
            ) : (
              <ArrowUp />
            )}
          </Button>
        );
      },
    },
    {
      displayName: "Létrehozva",
      accessorKey: "created",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) =>
        format(new Date(row.getValue("created")), "P", { locale: hu }),
    },
    {
      displayName: "Jelenlét",
      accessorKey: "status",
      header: "Jelenlét",
      cell: ({ row }) => (
        row.original.replacement ? 
        <div className="flex justify-center items-center gap-2">
          <p className="w-full rounded-full px-2 py-0.5 text-center bg-blue-500">Pótol</p>
          <AreYouSureAlert trigger={<Trash className="cursor-pointer" />} onConfirm={e => removeReplacement(e, row.original.replacement)} />
        </div>
        :
        <div className="flex justify-center items-center gap-2">
          <ToggleButton
            onText={"Jelen"}
            offText={"Hiányzik"}
            value={attended.includes(row.original.id)}
            onch={(e) => {
              if (!e) setAttended((p) => [...p, row.original.id]);
              else setAttended((p) => p.filter((v) => v != row.original.id));
            }}
          />
          {/* <TriangleAlert /> */}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col size-full gap-4 lg:flex-row">
      <div className="bg-primary-foreground rounded-xl size-full p-4">
        <Card className="w-full flex xl:flex-row flex-col mb-4">
          {nextLesson ? (
            <>
              <div className="p-4 pr-0 md:self-auto self-center md:w-32 w-20">
                <img src="https://seeklogo.com/images/S/scratch-cat-logo-7F652C6253-seeklogo.com.png" className="object-cover object-center rounded-md" />
              </div>
              <div className="flex flex-col">
                <CardHeader className="pb-4 md:pt-6 pt-0">
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-xl text-wrap">
                      {nextLesson.group.location.name}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-6 flex-wrap">
                    <span className="flex gap-2 items-center opacity-75">
                      <MapPin width={22} />
                      <p className="font-bold">
                        {nextLesson.group.location.name}
                        <br />
                        <span className="opacity-50">
                          {nextLesson.group.location.address}
                        </span>
                      </p>
                    </span>
                    <span className="flex gap-2 items-center opacity-75">
                      <Clock width={22} />
                      <p className="font-bold">
                        {`${format(nextLesson.start, "p", {locale: hu })} - ${format(nextLesson.end, "p", { locale: hu })}`}
                        <br />
                        <span className="opacity-50">
                          {format(nextLesson.start, "P", { locale: hu })}
                        </span>
                      </p>
                    </span>
                    <span className="flex gap-2 items-center opacity-75">
                      <User2 width={22} />
                      <p className="font-bold">
                        {nextLessonStudents && nextLessonStudents.length}
                      </p>
                    </span>
                  </div>
                </CardContent>
              </div>
              <Button
                className="m-4 xl:ml-auto xl:h-28 xl:aspect-square flex xl:flex-col gap-4"
                variant="outline"
                onClick={endLesson}
              >
                <X />
                Befejezés
              </Button>
            </>
          ) : (
            <CardContent className="flex gap-2 justify-center w-full pt-6">
              <p>Nincs közelgő óra </p>
              <Coffee />
            </CardContent>
          )}
        </Card>

        { nextLesson && nextLesson.length != 0 &&
        <>
          <h2>Tanulók</h2>
          <DataTable columns={columns} data={nextLessonStudents} 
            hideColumns={["created", "parent_name"]} 
            headerAfter={<ReplacementDialog originalLessonId={nextLesson.id} setNewStudents={setNextLessonStudents} />}
            />
        </>
        }
      </div>
      <div className="bg-primary-foreground rounded-xl size-full p-4">
        <WorkInProgress />
      </div>
    </div>
  );
}
