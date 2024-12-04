import { QuestMessage, YappingMessage } from '@/components/Messages'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Folder, MessageSquare } from 'lucide-react'
import React from 'react'

export const Home = () => {

  const data = [
    {
      id: "728ed52f",
      name: "Asd Fgh",
      email: "m@example.com",
      status: "pending",
    },
  ]

  const courses = [
    "LEGO WeDo 2.0 két féléves",
    "C#",
    "Lego WeDo 2.0",
    "Kodular I.",
    "Hardver",
    "Webfejlesztés (új)",
    "Webfejlesztés",
    "C++",
    "Lego WeDo 1.0",
    "Scratch Mester",
    "Unity 1. félév",
    "Scratch 2017",
    "Kodular Eagle I",
    "SCRATCH EREDETI",
    "Scratch 2022",
    "Scratch 2023 CS.GY.",
    "Kodular Eagle II",
    "Unity 2. félév (3D)"
  ]

  return (
    <div className='flex flex-col md:grid grid-cols-2 h-full grid-rows-2 gap-4'>
      <div className='bg-primary-foreground rounded-xl p-4'>
        <h2 className='text-center mb-4'>Következő óra</h2>
        <div>
          
        </div>
      </div>
      <div className='bg-primary-foreground row-span-2 rounded-xl p-4'>
        <h2 className='text-center mb-4'>Üzenetek</h2>
        <div className='flex flex-col gap-2'>
          <QuestMessage />
          <YappingMessage />
        </div>
      </div>
      <div className='bg-primary-foreground rounded-xl p-4'>
        <h2 className='text-center mb-2'>Segédletek</h2>
        <ScrollArea className='h-16 overflow-x-auto gap-2 py-2'>
          <div className='flex w-max gap-2'>
            {courses.map(e => <Button variant="outline" key={e} className="font-bold text-xl"><Folder strokeWidth={4} /> {e}</Button>)}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}
