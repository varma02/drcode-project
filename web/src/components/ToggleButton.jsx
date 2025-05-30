import React, { useState } from 'react'

export const ToggleButton = ({onText, offText, onch, value}) => {
  if (!onch)
   [value, onch] = useState(false)

  return (
    <div className={`relative w-full flex items-center ${value ? "bg-green-500" : "bg-red-500"} rounded-full px-2 py-0.5 select-none transition-all`} >
      <input type="checkbox" className='absolute top-0 left-0 size-full opacity-0 cursor-pointer' checked={value} onInput={(e) => onch(e.target.checked) } readOnly />
      <p className="w-full text-center">
        {value ? onText : offText}
      </p>
    </div>
  )
}
