import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './ui/dialog'

export const LessonCardItem = ({course, teacher, location = "Központ", time_start = "16:00", time_end = "17:00"}) => {
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
      <DialogTrigger>
        <div variant="outline" className='flex gap-2 justify-between items-center font-bold border rounded-lg p-2 cursor-pointer hover:bg-[#2a2a30] transition-all'>
          <img src="https://seeklogo.com/images/S/scratch-cat-logo-7F652C6253-seeklogo.com.png" className='max-w-8 object-cover object-center' />
          <div className='text-left'>
            <p>{course}</p>
            <p className='opacity-50'>{teacher}</p>
          </div>
          <p className='opacity-50'>{location}</p>
          <div>
            <p>{time_start}</p>
            <p>{time_end}</p>
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
