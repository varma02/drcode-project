import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className='flex flex-col flex-1 justify-center items-center gap-4'>
      <p className='text-9xl'>404</p>
      <p>Az oldal nem található</p>
      <Link to={"/"} viewTransition><Button variant={"outline"}>Vissza a főoldalra <ArrowRight /></Button></Link>
    </div>
  )
}
