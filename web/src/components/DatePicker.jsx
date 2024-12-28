import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from './ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'

export const DatePicker = ({numberOfMonths = 1, date, setDate, dateFormat = "PPP", showTimePicker}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, dateFormat, {locale: hu}) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          initialFocus
          numberOfMonths={numberOfMonths}
          showTimePicker={showTimePicker}
          date={date}
          setDate={setDate}
        />
      </PopoverContent>
    </Popover>
  )
}
