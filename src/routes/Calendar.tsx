import { Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { CalendarItem } from "../components/CalendarItem";

export default function Calendar() {
  
  interface CalendarItem {
    time: string;
    course: string;
    location: string;
    students: number;
    teacher?: string
  }

  const testClass = {time:"16:10 - 17:10", course:"Scratch", location:"Kodály Iskola", students:7}

  const calenderLayout: (CalendarItem | {})[][] = [
    [testClass, {}, testClass, {}, testClass, {}, testClass],
    [{}, testClass, {}, testClass, {}, testClass, {}]
  ];

  return (
    <div className="w-full p-5">
      <Table isStriped className="invisible sm:visible">
        <TableHeader>
          <TableColumn align="center" className="text-xl">Hétfő</TableColumn>
          <TableColumn align="center" className="text-xl">Kedd</TableColumn>
          <TableColumn align="center" className="text-xl">Szerda</TableColumn>
          <TableColumn align="center" className="text-xl">Csütörtök</TableColumn>
          <TableColumn align="center" className="text-xl">Péntek</TableColumn>
          <TableColumn align="center" className="text-xl">Szombat</TableColumn>
          <TableColumn align="center" className="text-xl">Vasárnap</TableColumn>
        </TableHeader>
        <TableBody>
          {
            calenderLayout.map((_e, i) => 
            <TableRow key={i}>
              {calenderLayout[i].map((r, j) => 
                <TableCell key={j}>
                  { Object.keys(r).length == 0 ? (
                    <Divider />
                  ) : (
                    <CalendarItem 
                      time={(r as CalendarItem).time} 
                      course={(r as CalendarItem).course} 
                      location={(r as CalendarItem).location} 
                      students={(r as CalendarItem).students} 
                      teacher={(r as CalendarItem).teacher} 
                    />
                  )}
                </TableCell>
              )}
              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </div>
  )
}