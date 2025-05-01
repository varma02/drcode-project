import React from 'react'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from './ui/avatar'
import { CircleHelp, Clock, MapPin, User2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'

export const LessonCardItem = ({lesson}) => {
  const navigate = useNavigate()

  return (
    <div variant="outline" className='w-max flex gap-2 border rounded-lg p-2 cursor-pointer hover:bg-[#2a2a30] transition-all relative' onClick={() => navigate("/lessons/"+lesson.id.replace("lesson:", ""))}>
      <div className='flex flex-col'>
        <CircleHelp />
      </div>
      <div className='flex gap-2'>
        <div>
          <p className='text-left text-xl'>{lesson.enroled[0] ? lesson.enroled[0].subject.name : "n/a"}</p>
          <div className='flex'>
            {
              lesson.group.teachers.map(t => t.name).map(e => 
                <Tooltip key={e}>
                  <TooltipTrigger asChild>
                    <Avatar className="-mr-4 border-4 border-background h-10 rounded-full w-auto">
                      <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" className="rounded-full" />
                      <AvatarFallback>BI</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{e}</p>
                  </TooltipContent>
                </Tooltip>
              )
            }
          </div>
        </div>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='w-32 flex items-center gap-1'>
                <MapPin className='min-w-max' size={16} />
                <p className='truncate'>{lesson.group.location.name}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{lesson.group.location.name}</p>
            </TooltipContent>
          </Tooltip>
          <p className='flex items-center gap-1 max-w-full my-1'><Clock size={16} /> {format(new Date(lesson.start), "p").split(" ")[0]} - {format(new Date(lesson.end), "p").split(" ")[0]}</p>
          <p className='flex items-center'><User2 size={16} className='mr-1' /> {lesson.enroled.length}</p>
        </div>
      </div>
    </div>
  )
}
