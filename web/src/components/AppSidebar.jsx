import { Calendar, ChevronUp, Home, Inbox, LogOut, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

// Menu items.
const items = [
  {
    title: "Főoldal",
    url: "/",
    icon: Home,
  },
  {
    title: "Üzenetek",
    url: "/inbox",
    icon: Inbox,
  },
  {
    title: "Beosztás",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Segédletek",
    url: "/search",
    icon: Search,
  },
  {
    title: "Beállítások",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dr Code</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="w-full flex justify-between items-center border rounded-lg p-2">
              <div className="flex justify-center items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
                  <AvatarFallback>FN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">Felhasználó Név</p>
                  <p className="text-left text-sm opacity-70">Tanár</p>
                </div>
              </div>
              <ChevronUp />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem><Settings /> Beállítások</DropdownMenuItem>
            <hr />
            <DropdownMenuItem className="text-red-500"><LogOut /> Kijelentkezés</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
