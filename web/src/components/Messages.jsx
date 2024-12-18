import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { ScrollArea } from './ui/scroll-area'
import { Button } from './ui/button'
import { MessageSquare } from 'lucide-react'
import { Textarea } from './ui/textarea'

export const AssignmentMessage = () => {

  const [showReply, setShowReply] = useState(false)

  return (
    <Card>
      <CardHeader className="flex flex-row gap-2 items-center">
        <Avatar>
          <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
          <AvatarFallback>BI</AvatarFallback>
        </Avatar>
        <div>
          <p className='font-bold'>Ivett</p>
          <p className='text-sm opacity-70'>Főnök 2</p>
        </div>
      </CardHeader>
      <CardContent>
        {/* <Textarea disabled className="scrollbar-thin cursor-pointer">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat quasi facilis nisi. Soluta necessitatibus rem cumque iste. Temporibus expedita distinctio qui magni, animi molestias est deserunt voluptatibus ea consequuntur aperiam.
          A repellendus inventore fuga nemo numquam! Dolor provident quia fugiat adipisci harum, veniam aliquam repellendus, eius obcaecati recusandae beatae placeat molestias quaerat quod error, asperiores eos iusto maiores. Fugiat, libero.
          Rem tempore, animi sunt sint ab magni numquam dolores explicabo facere earum doloremque beatae quas, quidem error quisquam cum adipisci repellat enim, ut mollitia minima ratione a. Ad, enim possimus.
          Recusandae, consequuntur laborum quisquam officiis pariatur ad architecto eveniet repellendus vero facere repudiandae blanditiis numquam deleniti maxime aspernatur neque placeat ex, sapiente adipisci explicabo dolore expedita quaerat vitae saepe! Eum?
        </Textarea> */}
        <ScrollArea className="h-16">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque laboriosam dolorem debitis esse eos quibusdam odit iste corporis obcaecati magni, iure minima, provident ipsum, libero enim. Laboriosam dolorum eos ipsa?
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className='flex w-full justify-between'>
          <Button className="font-bold">Elfogadom</Button>
          <Button variant="outline" className="font-bold" onClick={() => setShowReply(!showReply)}><MessageSquare /> Válasz (2)</Button>
        </div>
        {showReply && <Textarea placeholder="üzenet" />}
      </CardFooter>
    </Card>
  )
}

export const NotificationMessage = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row gap-2 items-center">
        <Avatar>
          <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
          <AvatarFallback>BI</AvatarFallback>
        </Avatar>
        <div>
          <p className='font-bold'>Ivett</p>
          <p className='text-sm opacity-70'>Főnök 2</p>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-16">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque laboriosam dolorem debitis esse eos quibusdam odit iste corporis obcaecati magni, iure minima, provident ipsum, libero enim. Laboriosam dolorum eos ipsa?
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
