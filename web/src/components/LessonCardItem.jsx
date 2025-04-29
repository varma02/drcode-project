import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './ui/dialog'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from './ui/avatar'
import { Clock, MapPin, User2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export const LessonCardItem = ({course = "Scratch", teachers = ["Legfőbb Ügyész", "Legfőbb Ügyész2"], location, time_start = "16:00", time_end = "17:00", student_count = 0}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div variant="outline" className='w-max flex gap-2 border rounded-lg p-2 cursor-pointer hover:bg-[#2a2a30] transition-all relative'>
          <div className='flex flex-col'>
            <img src="https://seeklogo.com/images/S/scratch-cat-logo-7F652C6253-seeklogo.com.png" className='max-w-8 max-h-8 object-cover object-center rounded-lg mt-2' />
          </div>
          <div className='flex gap-2'>
            <div>
              <p className='text-left text-xl'>{course}</p>
              <div className='flex'>
                {
                  teachers.map(e => 
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
                    <p className='truncate'>{location}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{location}</p>
                </TooltipContent>
              </Tooltip>
              <p className='flex items-center gap-1 max-w-full my-1'><Clock size={16} /> {time_start} - {time_end}</p>
              <p className='flex items-center'><User2 size={16} className='mr-1' /> {student_count}</p>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Test</DialogTitle>
        <DialogDescription>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sunt quaerat nulla, illum atque dicta tenetur. Quam et modi possimus sapiente deleniti praesentium doloremque, veniam reiciendis? Temporibus ex earum esse magni?
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
