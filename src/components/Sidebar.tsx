import { Image, User, Tabs, Tab, Link, Card, Button } from '@nextui-org/react'
import { HiArrowRightOnRectangle } from 'react-icons/hi2';
import { Outlet, useLocation } from 'react-router-dom';

export default function Sidebar () {
  const { pathname } = useLocation();
  
  return (
    <div className='flex min-h-screen'>
      <div className='w-64 flex-none p-4 flex flex-col shadow-xl shadow-black/25 dark:bg-content1 justify-between'>
        <div className='flex flex-col gap-6 p-2'>
          <Image width={"100%"} classNames={{img:"rounded-none"}} alt="Dr. Code" src="/logo.png" />
          <Tabs selectedKey={pathname} isVertical={true}
          aria-label="Tabs" classNames={{tabList: "w-full", base: "w-full font-bold", wrapper:"w-full"}} color='primary'>
            <Tab as={Link} key="/" href='/' title="Irányítópult" />
            <Tab as={Link} key="/calendar" href='/calendar' title="Naptár" />
          </Tabs>
        </div>
        <Card as={Button}
        classNames={{base:"p-2 flex flex-row gap-2 items-center justify-between"}}>
          <User
            name="Váradi Marcell" 
            avatarProps={{src: "https://avatars.githubusercontent.com/u/30373425?v=4"}}
            description="Tanár"
          />
          <Button variant='light' color='danger' className='h-full' isIconOnly>
            <HiArrowRightOnRectangle/>
          </Button>
        </Card>
      </div>
      <Outlet />
    </div>
  )
}