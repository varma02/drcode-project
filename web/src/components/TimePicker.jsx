import * as React from "react"
import { useState } from "react"
import { setHours, setMinutes } from "date-fns"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export const TimePicker = ({date, setDate, className, label, name}) => {
  const [timeValue, setTimeValue] = useState(`${date.getHours() == 0 ? "00" : date.getHours() }:${date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes()}`)

  const handleTimeChange = (e) => {
    const time = e.target.value
    if (!date) {
      setTimeValue(time)
      return
    }
    const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10))
    const newSelectedDate = setHours(setMinutes(date, minutes), hours)
    setDate(newSelectedDate)
    setTimeValue(time)
  }

  return (
    <div className="flex flex-col gap-2">
      <p>{label}</p>
      <Input type="time" className={`bg-transparent outline-none w-full text-center p-1 ${className}`} value={timeValue} onChange={handleTimeChange} name={name} />
    </div>
  )
}
