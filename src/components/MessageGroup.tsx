import { ReactNode } from 'react'

export default function MessageGroup ({date, children} : {date:string, children: ReactNode}) {
  
  return (
    <div>
      <p className='opacity-60 font-bold'>{date}</p>
      <div className='flex flex-col gap-2 font-normal'>
        {children}
      </div>
    </div>
  )
}
