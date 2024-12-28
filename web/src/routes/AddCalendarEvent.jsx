import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

export const AddCalendarEvent = () => {
  return (
    <div className='relative'>
      <Link to={"/calendar"} className='absolute top-0 left-0'><Button variant="outline"><ArrowLeft /></Button></Link>
      <div>AddCalendar</div>
    </div>
  )
}
