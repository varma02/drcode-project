import * as React from "react"
import { useState } from "react"
import { format, setHours, setMinutes } from "date-fns"
import { Input } from "./ui/input"

export const TimePicker = ({date, setDate, className, label, name}) => {
  const [timeValue, setTimeValue] = useState(`${format((date ? date : new Date()), "kk")}:${format((date ? date : new Date()), "mm")}`)

  const handleTimeChange = (e) => {
    const time = e.target.value
    if (!date) {
      setTimeValue(time)
      return
    }
    const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10))
    const newSelectedDate = setHours(setMinutes(date, minutes), hours)
    if (setDate) setDate(newSelectedDate)
    setTimeValue(time)
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <p>{label}</p>}
      <Input type="time" className={`bg-transparent outline-none w-full text-center p-1 ${className}`} value={timeValue} onChange={handleTimeChange} name={name} />
    </div>
  )
}
