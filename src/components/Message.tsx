import { useState } from 'react'

export default function Message ({name, message} : {name:string, message:string}) {

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='p-2 rounded-xl flex items-center gap-2 cursor-pointer hover:opacity-70 transition-all overflow-hidden select-none shadow-lg shadow-black/25' onClick={() => setIsOpen(!isOpen)}>
      <div className='min-w-10 min-h-10 bg-primary rounded-full flex justify-center items-center font-bold text-xl'>{name[0]}</div>
      <div className='w-full'>
        <p className='font-bold'>{name}</p>
        <p className={`${isOpen ? "whitespace-normal" : "whitespace-nowrap"} overflow-hidden text-ellipsis max-w-full pr-14 transition-all`}>{message}</p>
      </div>
    </div>
  )
}
