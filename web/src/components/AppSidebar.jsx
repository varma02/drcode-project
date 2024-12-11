import { Calendar, ChevronsUpDown, Home, Inbox, LogOut, Search, Settings, ShieldX } from "lucide-react"

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
import { getTopRole, useAuth } from "@/lib/api/AuthProvider"
import { toast } from "sonner"


export function AppSidebar() {
  const auth = useAuth();

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
          <DropdownMenuTrigger className="outline-none" aria-label="Felhasználó menü">
            <div className="w-full flex justify-between items-center border rounded-lg p-2">
              <div className="flex justify-center items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
                  <AvatarFallback>{auth.user.name.split(" ").slice(0, 2).map(v => v[0]).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-left">{auth.user.name.length > 14 ? auth.user.name.slice(0, 12) + "..." : auth.user.name}</p>
                  <p className="text-left text-sm opacity-70">{getTopRole(auth.user.roles)}</p>
                </div>
              </div>
              <ChevronsUpDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Settings /> Beállítások
            </DropdownMenuItem>
            <hr />
            <DropdownMenuItem className="text-red-500" onSelect={() => {auth.logout(); toast.success("Sikeres kijelentkezés!")}}>
              <LogOut /> Kijelentkezés
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
