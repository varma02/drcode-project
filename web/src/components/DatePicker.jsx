import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from './ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'

export const DatePicker = ({numberOfMonths = 1, date = new Date(), setDate, dateFormat = "PPP", showTimePicker, name, includeTime, required = false}) => {
  const [value, setValue] = useState(date)

  function changeDate(newDate) {
    if (newDate == date) return
    if (setDate) setDate(newDate)
    setValue(newDate)
  }

  return (
    <Popover>
      <input type="text" name={name} value={includeTime ? value.toISOString() : value.toISOString().slice(0, 10)} onChange={() => {}} className="hidden" />
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, dateFormat, {locale: hu}) : <span>Válassz egy dátumot</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          required={required}
          mode="single"
          selected={value}
          initialFocus
          numberOfMonths={numberOfMonths}
          showTimePicker={showTimePicker}
          date={value}
          setDate={changeDate}
        />
      </PopoverContent>
    </Popover>
  )
}
