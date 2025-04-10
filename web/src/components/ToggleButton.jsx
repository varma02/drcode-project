import React, { useState } from 'react'

export const ToggleButton = ({onText, offText}) => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div className={`flex items-center space-x-4 ${isToggled ? "bg-green-500" : "bg-red-500"} rounded-full px-2 py-0.5 select-none cursor-pointer transition-all`} onClick={() => setIsToggled((prevState) => !prevState)}>
      <p className="w-full text-center">
        {isToggled ? onText : offText}
      </p>
    </div>
  )
}
