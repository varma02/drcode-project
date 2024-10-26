import { Button, Divider } from '@nextui-org/react'

export const CalendarItem = ({ time, course, location, students, teacher }: { time: string, course: string, location: string, students: number, teacher?: string }) => {

  return (
    <Button variant="ghost" className="p-5 gap-4 h-full">
      <div className="flex flex-col pl-2 w-max">
        <p className="text-foreground/80 text-lg">{time}</p>
        <Divider className="my-1" />
        { teacher &&
          <h4 className="font-semibold text-foreground/90">
            <span className="pr-2 text-foreground/70 font-medium">Oktató:</span>
            {teacher}
          </h4>
        }
        <h4 className="font-semibold text-foreground/90">
          <span className="pr-2 text-foreground/70 font-medium">Kurzus:</span>
          {course}
        </h4>
        <h4 className="font-semibold text-foreground/90">
          <span className="pr-2 text-foreground/70 font-medium">Helyszín:</span>
          {location}
        </h4>
        <h4 className="font-semibold text-foreground/90">
          <span className="pr-2 text-foreground/70 font-medium">Diákok száma:</span>
          {students}
        </h4>
      </div>
    </Button>
  )
}
