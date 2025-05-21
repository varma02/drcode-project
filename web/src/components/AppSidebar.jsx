import { Album, BriefcaseBusiness, Calendar, ChevronsUpDown, Clock, Component, GraduationCap, Home, LogOut, MapPinned, Settings, Users } from "lucide-react"
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
import { Fragment, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"


export function AppSidebar() {
  const navigate = useNavigate();
  const auth = useAuth();
  const href = useHref();
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const items = {
    "DR CODE": [
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
      }
    ],
    "ADMIN": [
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

  const sidebarAnimation = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const logoAnimation = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.2
      }
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Sidebar className="glass-effect shadow-lg">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sidebarAnimation}
        className="h-full flex flex-col justify-between"
      >
        <div className="p-4 flex justify-between items-center">
          <motion.div 
            variants={logoAnimation}
            initial="initial"
            animate="animate"
            className="flex items-center gap-3"
          >
            <motion.div 
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 15px rgba(var(--primary-rgb)/0.5)"
              }}
              className="h-10 w-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-lg"
            >
              DC
            </motion.div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <h3 className="text-lg font-semibold tracking-tight">Dr Code</h3>
                  <p className="text-xs text-muted-foreground">Admin felület</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCollapse}
            className="hover:bg-white/10 transition-colors"
          >
            <ChevronsUpDown size={16} className="text-muted-foreground" />
          </Button>
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-4"
            >
              <Breadcrumb>
                <BreadcrumbList className="text-sm text-muted-foreground">
                {
                  pathname.slice(1, pathname.length).split("/").map((e, i) => (
                    <Fragment key={e+i}>
                    <BreadcrumbItem>
                      <Link to={"/"+e} className="hover:text-primary transition-colors">
                        {e in route_map ? route_map[e] : e[0].toUpperCase() + e.substring(1, e.length)}
                      </Link>
                    </BreadcrumbItem>
                    { i != pathname.slice(1, pathname.length).split("/").length-1 &&
                      <BreadcrumbSeparator />
                    }
                    </Fragment>
                  ))
                }
                </BreadcrumbList>
              </Breadcrumb>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-grow overflow-y-auto scrollbar-thin">
          <SidebarContent>            
            {Object.keys(items)
              .filter(e => getTopRole(auth.user.roles) != "Adminisztrátor" ? e != "ADMIN" : true)
              .map((e, groupIndex) => (
                <motion.div key={e} variants={itemAnimation}>
                  <SidebarGroup className="mt-4">
                    <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      {e}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {items[e].map((item) => {
                          const isActive = (href.startsWith(item.url) && item.url !== "/") || href === item.url;
                          
                          return (
                            <SidebarMenuItem key={item.title} variants={itemAnimation} className={isActive ? "sidebar-item-active" : ""}>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <SidebarMenuButton asChild>
                                      <Link 
                                        to={item.url} 
                                        className={`
                                          hover-scale
                                          ${isActive ? 
                                            "bg-primary text-primary-foreground shadow-lg relative overflow-hidden" : 
                                            "hover:bg-white/10 transition-all duration-200"}
                                        `}
                                      >
                                        {isActive && (
                                          <motion.div 
                                            className="absolute inset-0 bg-white/10 pointer-events-none"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0.1, 0.15, 0.1] }}
                                            transition={{ 
                                              duration: 2, 
                                              ease: "easeInOut", 
                                              repeat: Infinity,
                                            }}
                                          />
                                        )}
                                        <item.icon className={isActive ? "" : "text-muted-foreground"} />
                                        {!isCollapsed && <span>{item.title}</span>}
                                      </Link>
                                    </SidebarMenuButton>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="glass-effect" hidden={!isCollapsed}>
                                    {item.title}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </motion.div>
              ))
            }
          </SidebarContent>
        </div>
        
        <div className="mt-auto">
          <SidebarFooter className="border-t border-white/10 bg-white/5 backdrop-blur-sm py-2 mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger aria-label="Felhasználó menü" asChild>
                <Button 
                  variant="ghost" 
                  className="h-auto flex justify-between items-center p-4 w-full rounded-none hover:bg-white/10"
                >
                  <div className="flex justify-center items-center gap-3">
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Avatar className="h-10 w-10 border-2 border-primary/30 shadow-md">
                        <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
                        <AvatarFallback className="bg-primary/20 text-primary-foreground">
                          {getMonogram(auth.user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                        >
                          <p className="font-medium text-left">
                            {auth.user.name.length > 15 ? auth.user.name.slice(0, 15) + "..." : auth.user.name}
                          </p>
                          <p className="text-left text-xs text-muted-foreground">
                            {getTopRole(auth.user.roles)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <ChevronsUpDown size={16} className="text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-effect">
                <DropdownMenuItem 
                  onSelect={() => navigate("/settings")} 
                  className="flex items-center gap-2 cursor-pointer hover:bg-white/10"
                >
                  <Settings size={14} /> Beállítások
                </DropdownMenuItem>
                <hr className="opacity-10 my-1" />
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-red-400 cursor-pointer hover:text-red-300 hover:bg-red-500/10" 
                  onSelect={() => {
                    auth.logout(); 
                    toast.success("Sikeres kijelentkezés!")
                  }}
                >
                  <LogOut size={14} /> Kijelentkezés
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </div>
      </motion.div>
    </Sidebar>
  );
}
