import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './ui/dialog'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from './ui/avatar'
import { Clock, Ellipsis, MapPin, User2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Button } from './ui/button'

export const LessonCardItem = ({course = "Scratch", teachers = ["Legfőbb ügyész", "Népírtás"], location, time_start = "16:00", time_end = "17:00"}) => {
  console.log("AAAAAAAAAAAAAAAAAAAAAAAA: ", location)
  // console.log(teachers)
  return (
    // <Card className="w-full">
    //   <CardContent className="mt-6">
    //     <div className='flex items-center gap-4'>
    //       {/* <img src="https://seeklogo.com/images/S/scratch-cat-logo-7F652C6253-seeklogo.com.png" className='max-w-36 object-cover object-center' /> */}
    //       <div className='flex flex-col gap-2'>
    //         <div className='flex gap-2'><BookOpen /> <p>Scratch</p></div>
    //         <div className='flex gap-2'><Clock /> <p>Hétfő 16:00</p></div>
    //         <div className='flex gap-2'><MapPin />  <p>Arany Iskola</p></div>
    //         <div className='flex gap-2'><User2 />  <p>6</p></div>
    //       </div>
    //     </div>
    //   </CardContent>
    //   <CardFooter>
    //     <Button className="w-full font-bold">Segédlet</Button>
    //   </CardFooter>
    // </Card>
    <Dialog>
      <DialogTrigger className='w-full'>
        <div variant="outline" className='flex gap-2 border rounded-lg p-2 cursor-pointer hover:bg-[#2a2a30] transition-all relative'>
          <div className='flex flex-col'>
            <img src="https://seeklogo.com/images/S/scratch-cat-logo-7F652C6253-seeklogo.com.png" className='max-w-8 max-h-8 object-cover object-center rounded-lg mt-2' />
            {/* <img src="https://seeklogo.com/images/S/scratch-cat-logo-7F652C6253-seeklogo.com.png" className='max-w-8 max-h-8 object-cover object-center rounded-lg mt-2' /> */}
          </div>
          <div className='w-full'>
            <p className='text-left text-xl'>Scratch</p>
            <div className='flex'>
              {
                teachers.map(e => 
                  <Tooltip>
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
            {/* <p className='flex items-center absolute bottom-6 left-2.5'><User2 size={16} /> 11</p> */}
            <p className='flex items-center'><User2 size={16} /> 11</p>
          </div>
        </div>
        {/* <div variant="outline" className='flex gap-2 justify-between items-center font-bold border rounded-lg p-2 cursor-pointer hover:bg-[#2a2a30] transition-all'>
          <img src="https://seeklogo.com/images/S/scratch-cat-logo-7F652C6253-seeklogo.com.png" className='max-w-8 object-cover object-center' />
          <div className='text-left'>
            <p>{course}</p>
            <p className='opacity-50'>{teachers}</p>
          </div>
          <p className='opacity-50'>{locations}</p>
          <div>
            <p>{time_start}</p>
            <p>{time_end}</p>
          </div>
        </div> */}
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
