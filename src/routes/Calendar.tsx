import { Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { CalendarItem } from "../components/CalendarItem";

export default function Calendar() {

  const testClass0 = {id:0, time:"16:10 - 17:10", course:"Scratch", location:"Kodály Iskola", students:7}
  const testClass1 = {id:1, time:"16:10 - 17:10", course:"Scratch", location:"Kodály Iskola", students:7}
  const testClass2 = {id:2, time:"16:10 - 17:10", course:"Scratch", location:"Kodály Iskola", students:7}
  const testClass3 = {id:3, time:"16:10 - 17:10", course:"Scratch", location:"Kodály Iskola", students:7}
  const testClass4 = {id:4, time:"16:10 - 17:10", course:"Scratch", location:"Kodály Iskola", students:7}
  const testClass5 = {id:5, time:"16:10 - 17:10", course:"Scratch", location:"Kodály Iskola", students:7}
  const testClass6 = {id:6, time:"16:10 - 17:10", course:"Scratch", location:"Kodály Iskola", students:8}

  const calendarLayout = {
    monday: [testClass0],
    tuesday: [testClass1],
    wednesday: [testClass2],
    thursday: [testClass3],
    friday: [testClass4, testClass6],
    saturday: [testClass5]
  }

  const rows = []
  for (let i = 0; i < Math.max(...Object.values(calendarLayout).map(e => e.length)); i++) {
    rows.push(
      <TableRow key={i}>
        {
          Object.keys(calendarLayout).map(day => 
            <TableCell key={day+i}>
              { calendarLayout[day][i] == undefined ? 
                <Divider /> 
                :
                <CalendarItem time={calendarLayout[day][i].time} course={calendarLayout[day][i].course} location={calendarLayout[day][i].location} students={calendarLayout[day][i].students} />
              }
            </TableCell> 
          )
        }
      </TableRow>
    )
  }

  return (
    <div className="w-full p-5">
      <Table isStriped className="invisible sm:visible">
        <TableHeader>
          <TableColumn align="center" className="text-xl" key="monday">Hétfő</TableColumn>
          <TableColumn align="center" className="text-xl" key="tuesday">Kedd</TableColumn>
          <TableColumn align="center" className="text-xl" key="wednesday">Szerda</TableColumn>
          <TableColumn align="center" className="text-xl" key="thursday">Csütörtök</TableColumn>
          <TableColumn align="center" className="text-xl" key="friday">Péntek</TableColumn>
          <TableColumn align="center" className="text-xl" key="saturday">Szombat</TableColumn>
        </TableHeader>
        <TableBody>
          { rows }
        </TableBody>
      </Table>
    </div>
  )
}