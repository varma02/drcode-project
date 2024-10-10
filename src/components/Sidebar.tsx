import { Image, User, Tabs, Tab, Link, Card, Button, NavbarMenuToggle, Navbar, NavbarContent, NavbarBrand, NavbarItem, NavbarMenu, NavbarMenuItem, Avatar } from '@nextui-org/react'
import { useState } from 'react';
import { HiArrowRightOnRectangle } from 'react-icons/hi2';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  {href: "/", title: "Irányítópult"},
  {href: "/calendar", title: "Naptár"},
]

export default function Sidebar () {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div className='flex min-h-screen md:flex-row flex-col'>
      <Navbar onMenuOpenChange={setIsMenuOpen} disableAnimation={true} isBlurred={false}
      classNames={{base:"md:w-56 bg-content1 md:p-4 md:shadow-md", wrapper: "md:flex-col md:h-full md:justify-between md:p-0 p-2"}}>
        <NavbarContent className="md:justify-start md:flex-col md:pl-0 pl-2">
          <NavbarMenuToggle aria-label={isMenuOpen ? "Menü bezárása" : "Menü megnyitása"} className="md:hidden" />
          
          <Image removeWrapper className='rounded-none md:h-fit h-6 pb-1' alt="Dr. Code" src="/logo.png" />

          <Tabs selectedKey={pathname} isVertical={true} className='md:flex hidden'
          aria-label="Tabs" classNames={{tabList: "w-full", base: "w-full font-bold", wrapper:"w-full"}} color='primary'>
            {menuItems.map((item) => (
              <Tab as={Link} key={item.href} href={item.href} title={item.title} />
            ))}
          </Tabs>
        </NavbarContent>

        <NavbarContent className="">
          <Card as={Button} onClick={()=>navigate("/user")} className="md:flex hidden flex-none mt-auto"
          classNames={{base:"p-2 flex flex-row gap-2 items-center justify-between"}}>
            <User
              name="Váradi Marcell" 
              description="Tanár"
              avatarProps={{src: "https://avatars.githubusercontent.com/u/30373425?v=4"}}
            />
            <Button variant='light' color='danger' isIconOnly>
              <HiArrowRightOnRectangle/>
            </Button>
          </Card>

          <Avatar as={Link} href="/user" src="https://avatars.githubusercontent.com/u/30373425?v=4"
          className="md:hidden ml-auto" size="sm"/>
        </NavbarContent>

        <NavbarMenu className="bg-black/80 backdrop-blur-lg">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={index}>
              <Link className="w-full" color={pathname == item.href ? "primary" : "foreground"} href={item.href} size="lg">
                {item.title}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>

      <Outlet />
    </div>
  )
}