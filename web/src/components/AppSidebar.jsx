import { Calendar, ChevronsUpDown, Home, Inbox, LogOut, Search, Settings, ShieldX, User2, Users } from "lucide-react"

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
import { Link, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAuth } from "@/lib/api/AuthProvider"
import { toast } from "sonner"
import { getMonogram, getTopRole } from "@/lib/utils"


export function AppSidebar() {
  const navigate = useNavigate();
  const auth = useAuth();

  const items = {
    "Dr Code": [
      {
        title: "Főoldal",
        url: "/",
        icon: Home,
      },
      {
        title: "Beosztás",
        url: "/calendar",
        icon: Calendar,
      },
      {
        title: "Üzenetek",
        url: "/inbox",
        icon: Inbox,
      },
      {
        title: "Segédletek",
        url: "/search",
        icon: Search,
      },
    ],
    "Admin": [
      {
        title: "Alkalmazottak",
        url: "/employee",
        icon: Users,
      },
    ]
  }

  return (
    <Sidebar>
      <SidebarContent>
          {
            Object.keys(items).map(e => 
            <SidebarGroup key={e}>
              <SidebarGroupLabel>{e}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items[e].map((item) => (
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
            )
          }
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none" aria-label="Felhasználó menü">
            <div className="w-full flex justify-between items-center border rounded-lg p-2">
              <div className="flex justify-center items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
                  <AvatarFallback>{getMonogram(auth.user.name)}</AvatarFallback>
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
            <DropdownMenuItem onSelect={() => navigate("/settings")}>
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
