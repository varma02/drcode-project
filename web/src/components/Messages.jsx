import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { ScrollArea } from './ui/scroll-area'
import { Button } from './ui/button'
import { Ellipsis, MessageSquare, SendHorizonal } from 'lucide-react'
import { Textarea } from './ui/textarea'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Separator } from './ui/separator'

export const AssignmentMessage = () => {

  const [showReply, setShowReply] = useState(false)

  return (
    <Card className="mb-2">
      <CardHeader className="flex flex-row gap-2 items-center space-y-0">
        <Avatar>
          <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
          <AvatarFallback>BI</AvatarFallback>
        </Avatar>
        <div>
          <p className='font-bold'>Ivett</p>
          <p className='text-sm opacity-70'>Főnök 2</p>
        </div>
        <p className='ml-auto text-sm opacity-70'>2025.01.01. 13:41</p>
      </CardHeader>
      <CardContent>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus provident earum nam repudiandae odio id ea eius ipsa, nesciunt cumque minima consequuntur magni. Ullam, nobis minima impedit porro unde a dignissimos, ipsam sed corporis consequatur expedita! Animi veniam debitis nobis, enim, expedita esse quod deserunt molestias possimus earum sunt accusamus.
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className='flex w-full gap-4'>
          <Button className="font-bold">Elfogadom</Button>
          <Popover>
            <PopoverTrigger className='flex' asChild>
              <Button variant="ghost" className="flex pr-6 pl-2 py-1">
                <Avatar className="-mr-4 border-4 border-background h-full w-auto">
                  <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
                  <AvatarFallback>BI</AvatarFallback>
                </Avatar>
                <Avatar className="-mr-4 border-4 border-background h-full w-auto">
                  <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
                  <AvatarFallback>BI</AvatarFallback>
                </Avatar>
                <Avatar className="-mr-4 border-4 border-background h-full w-auto">
                  <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
                  <AvatarFallback>BI</AvatarFallback>
                </Avatar>
                <Avatar className="-mr-4 border-4 border-background h-full">
                  <AvatarFallback><Ellipsis /></AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <ScrollArea className="h-52">
                {new Array(10).fill(0).map((_, i) => (
                  <div key={i} className='flex gap-4 mb-4'>
                    <Avatar>
                      <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
                      <AvatarFallback>LÜ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-bold'>Legfőbb Ügyész</p>
                      <p className='text-sm opacity-70'>Adminisztrátor</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </PopoverContent>
          </Popover>
          <Button variant="outline" className="font-bold ml-auto" onClick={() => setShowReply(!showReply)}><MessageSquare /> Válasz (2)</Button>
        </div>
        {showReply && <div className='w-full flex flex-col pt-4 gap-4'>
          <form className='flex gap-4 mb-4' onSubmit={(e)=>{e.preventDefault();toast.info('Üzenet elküldve')}}>
            <Textarea placeholder="Üzenet" className="min-h-10 max-h-48" />
            <Button className="ml-auto" variant="outline" size="icon"><SendHorizonal /></Button>
          </form>
          <div className='flex gap-6'>
            <Separator orientation="vertical" className="h-auto" />
            <div className='flex flex-col gap-8'>
              <div className='flex flex-col gap-4'>
                <div className='flex gap-4 items-center'>
                  <Avatar>
                    <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
                    <AvatarFallback>LÜ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-bold'>Legfőbb Ügyész</p>
                    <p className='text-sm opacity-70'>Adminisztrátor</p>
                  </div>
                  <p className='ml-auto text-sm opacity-70'>2025.01.01. 13:41</p>
                </div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, nesciunt beatae quis perferendis suscipit, voluptas minus soluta consequuntur accusantium facilis nobis adipisci doloremque aperiam fuga numquam dolorum provident aliquam consequatur reprehenderit recusandae nam magnam, magni odit architecto. Magni dolore, neque beatae, perspiciatis cum quisquam laudantium placeat praesentium porro eum totam?
                </p>
              </div>
              <div className='flex flex-col gap-4'>
                <div className='flex gap-4 items-center'>
                  <Avatar>
                    <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
                    <AvatarFallback>LÜ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-bold'>Legfőbb Ügyész</p>
                    <p className='text-sm opacity-70'>Adminisztrátor</p>
                  </div>
                  <p className='ml-auto text-sm opacity-70'>2025.01.01. 13:41</p>
                </div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, nesciunt beatae quis perferendis suscipit, voluptas minus soluta consequuntur accusantium facilis nobis adipisci doloremque aperiam fuga numquam dolorum provident aliquam consequatur reprehenderit recusandae nam magnam, magni odit architecto. Magni dolore, neque beatae, perspiciatis cum quisquam laudantium placeat praesentium porro eum totam?
                </p>
              </div>
            </div>
          </div>
        </div>}
      </CardFooter>
    </Card>
  )
}

export const NotificationMessage = () => {
  return (
    <Card className="mb-2">
      <CardHeader className="flex flex-row gap-2 items-center space-y-0">
        <Avatar>
          <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
          <AvatarFallback>BI</AvatarFallback>
        </Avatar>
        <div>
          <p className='font-bold'>Ivett</p>
          <p className='text-sm opacity-70'>Főnök 2</p>
        </div>
        <p className='ml-auto text-sm opacity-70'>2025.01.01. 13:41</p>
      </CardHeader>
      <CardContent>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas, nulla inventore! Hic assumenda quibusdam optio id, laudantium odio, possimus ut quod vel praesentium facilis repellat facere quae quidem quasi tenetur molestiae impedit eligendi nisi. Neque, asperiores sequi. Fugiat assumenda sunt, aperiam soluta neque voluptatem culpa illo explicabo voluptas fugit! Quisquam saepe veniam libero pariatur optio, nesciunt possimus fugiat accusantium esse debitis ipsum praesentium nulla reiciendis error expedita suscipit. Maiores hic, dolorum veritatis excepturi placeat voluptatum fugit velit a delectus tempore rerum porro mollitia earum cupiditate, cum, ea dicta necessitatibus! Temporibus necessitatibus eos consectetur veniam tempore! Nemo quo reiciendis dicta impedit?
      </CardContent>
    </Card>
  )
}
