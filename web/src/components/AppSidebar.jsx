import { Album, BriefcaseBusiness, Calendar, ChevronsUpDown, Clock, Component, GraduationCap, Home, LogOut, MapPinned, Search, Settings, Users } from "lucide-react"
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
import { Link, useHref, useLocation, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAuth } from "@/lib/api/AuthProvider"
import { toast } from "sonner"
import { getMonogram, getTopRole, route_map } from "@/lib/utils"
import { Button } from "./ui/button"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "./ui/breadcrumb"
import { Fragment } from "react"


export function AppSidebar() {
  const navigate = useNavigate();
  const auth = useAuth();
  const href = useHref();
  const { pathname } = useLocation();

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
        title: "Jelenléti ív",
        url: "/worksheet",
        icon: BriefcaseBusiness,
      },
      {
        title: "Statisztika",
        url: "/helper",
        icon: Search,
      },
    ],
    "Admin": [
      {
        title: "Admin Főoldal",
        url: "/admin",
        icon: Home,
      },
      {
        title: "Alkalmazottak",
        url: "/employee",
        icon: Users,
      },
      {
        title: "Tanulók",
        url: "/students",
        icon: GraduationCap,
      },
      {
        title: "Csoportok",
        url: "/groups",
        icon: Component,
      },
      {
        title: "Órák",
        url: "/lessons",
        icon: Clock,
      },
      {
        title: "Helyszínek",
        url: "/locations",
        icon: MapPinned,
      },
      {
        title: "Kurzusok",
        url: "/subjects",
        icon: Album,
      },
    ]
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={"-mb-0"}>
            <Breadcrumb>
              <BreadcrumbList>
              {
                pathname.slice(1, pathname.length).split("/").map((e, i) => (
                  <Fragment key={e+i}>
                  <BreadcrumbItem>
                    <Link to={"/"+e}>{e in route_map ? route_map[e] : e[0].toUpperCase() + e.substring(1, e.length)}</Link>
                  </BreadcrumbItem>
                  { i != pathname.slice(1, pathname.length).split("/").length-1 &&
                    <BreadcrumbSeparator />
                  }
                  </Fragment>
                ))
              }
              </BreadcrumbList>
            </Breadcrumb>
            {/* <p>{ pathname }</p> */}
          </SidebarGroupLabel>
        </SidebarGroup>
          {
            Object.keys(items).filter(e => getTopRole(auth.user.roles) != "Adminisztrátor" ? e != "Admin" : true).map(e => 
            <SidebarGroup key={e}>
              <SidebarGroupLabel>{e}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items[e].map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link to={item.url} className={
                          (href.startsWith(item.url) && item.url != "/") || href === item.url ?
                          "!bg-primary !text-primary-foreground" : ""
                        }>
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
          <DropdownMenuTrigger aria-label="Felhasználó menü" asChild>
            <Button variant="ghost" className="h-auto flex justify-between items-center p-2">
              <div className="flex justify-center items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
                  <AvatarFallback>{getMonogram(auth.user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-left">{auth.user.name.length > 15 ? auth.user.name.slice(0, 15) + "..." : auth.user.name}</p>
                  <p className="text-left text-sm opacity-70">{getTopRole(auth.user.roles)}</p>
                </div>
              </div>
              <ChevronsUpDown />
            </Button>
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
