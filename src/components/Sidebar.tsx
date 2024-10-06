import { Button, Image, User } from '@nextui-org/react'

export default function Sidebar () {
  return (
    <div className='w-64 p-6 flex flex-col shadow-xl shadow-black/25 dark:bg-[#1b1b1f] justify-between'>
      <div className='flex flex-col gap-6'>
        <Image width={"100%"} classNames={{img:"rounded-none"}} alt="Dr. Code" src="/logo.png" />
        <div className='flex flex-col gap-2'>
          <Button color='primary' className='text-2xl font-bold'>Dashboard</Button>
          <Button color='primary' className='text-2xl font-bold'>Órarend</Button>
        </div>
      </div>
      <User name="Name" avatarProps={{src: "https://avatars.githubusercontent.com/u/30373425?v=4"}} />
    </div>
  )
}