import DataTable from '@/components/DataTable';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { create, getAll, remove } from '@/lib/api/api';
import { useAuth } from '@/lib/api/AuthProvider';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { ArrowDown, ArrowUp, ArrowUpDown, Copy, Filter, LoaderCircle, Mail, MoreHorizontal, Plus, Search, SquareArrowOutUpRight, Trash2, UserPlus, Users, Briefcase, Building2, GraduationCap } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { convertToMultiSelectData, getMonogram, getTopRole, role_map } from '@/lib/utils';
import { GroupComboBox } from '@/components/GroupComboBox';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import AreYouSureAlert from '@/components/AreYouSureAlert';
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from '@/components/MultiSelect';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Employee() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([])
  const [invites, setInvites] = useState([]);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [rowSelection, setRowSelection] = useState({})
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAll(auth.token, 'invite'),
      getAll(auth.token, 'employee')
    ]).then(([invitesRes, employeesRes]) => {
      setInvites(invitesRes.data.invites);
      setEmployees(employeesRes.data.employees);
      setIsLoading(false);
    }).catch(err => {
      toast.error("Hiba történt az adatok betöltése közben");
      setIsLoading(false);
    });
  }, [])
  
  const columns = [
    {
      id: "select",
      ignoreClickEvent: true,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          className="float-left"
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          className="float-left"
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      displayName: "Név",
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {column.columnDef.displayName}
            {!column.getIsSorted() ? <ArrowUpDown className="ml-2 h-4 w-4" /> 
            : column.getIsSorted() === "asc" ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUp className="ml-2 h-4 w-4" />}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className='flex items-center gap-3'>
          <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-md">
            <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
            <AvatarFallback className="bg-primary/10 text-primary-foreground">{getMonogram(row.getValue("name"))}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.getValue("name")}</div>
            <div className="text-xs text-muted-foreground">{getTopRole(row.getValue("roles"))}</div>
          </div>
        </div>
      ),
    },
    {
      displayName: "Email",
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {column.columnDef.displayName}
            {!column.getIsSorted() ? <ArrowUpDown className="ml-2 h-4 w-4" /> 
            : column.getIsSorted() === "asc" ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUp className="ml-2 h-4 w-4" />}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center">
          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="lowercase">{row.getValue("email")}</span>
        </div>
      ),
    },
    {
      displayName: "Létrehozva",
      accessorKey: "created",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="whitespace-nowrap"
          >
            {column.columnDef.displayName}
            {!column.getIsSorted() ? <ArrowUpDown className="ml-2 h-4 w-4" /> 
            : column.getIsSorted() === "asc" ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUp className="ml-2 h-4 w-4" />}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="text-sm">{format(new Date(row.getValue("created")), "PPP", {locale: hu} )}</div>
      ),
    },
    {
      displayName: "Szerepkör",
      accessorKey: "roles",
      header: "Szerepkör",
      cell: ({ row }) => (
        <div className='flex gap-2 flex-wrap'>
          {row.getValue("roles").map(role => (
            <Badge 
              key={role} 
              className={`
                ${role === "administrator" 
                  ? "bg-gradient-to-r from-red-500 to-red-700 border-red-400" 
                  : "bg-gradient-to-r from-emerald-500 to-emerald-700 border-emerald-400"
                } 
                font-medium border shadow-sm whitespace-nowrap animate-in fade-in-50
              `}
            >
              {role_map[role]}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menü megnyitása</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-effect">
              <DropdownMenuLabel>Műveletek</DropdownMenuLabel>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => navigate(row.original.id.replace("employee:", ""))}
              >
                Részletes adatok
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-400 cursor-pointer hover:text-red-500"
                onClick={() => {
                  const newSelection = {};
                  newSelection[row.id] = true;
                  setRowSelection(newSelection);
                  document.getElementById("delete-button").click();
                }}
              >
                Törlés
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  function handleInvite(event) {
    event.preventDefault();
    setInviteLoading(true);
    const formdata = new FormData(event.target);
    const roles = {
      roles: formdata.get("roles").split(",")
    }
    create(auth.token, "invite", roles).then((v) => {
      setInviteLoading(false);
      setSelectedInvite(v.data.invite);
      setInvites([...invites, v.data.invite]);
      toast.success("Meghívó létrehozva");
    }).catch((e) => {
      setInviteLoading(false);
      if(e.response && e.response.data && e.response.data.code == "fields_required") {
        toast.error("Legalább egy szerepkört megadása kötelező");
      } else {
        toast.error("Hiba történt a meghívó létrehozása közben");
      }
    });
  }

  function handleInviteRemove(event) {
    event.preventDefault();
    remove(auth.token, 'invite', [selectedInvite.id]).then((v) => {
      setInvites(invites.filter(i => i.id != selectedInvite.id));
      setInviteDialogOpen(false);
      toast.success("Meghívó visszavonva");
    }).catch((e) => {
      if(e.response && e.response.data && e.response.data.code == "not_found") {
        toast.error("A meghívó nem található");
      } else {
        toast.error("Hiba történt a meghívó visszavonása közben");
      }
    });
  }

  function handleDelete() {
    remove(auth.token, 'employee', Object.keys(rowSelection).map(e => employees[+e].id)).then(resp => {
      setEmployees(p => p.filter(e => !resp.data.employees.includes(e.id)))
      setRowSelection({})
      toast.success(`${Object.keys(rowSelection).length} alkalmazott sikeresen törölve`);
    }).catch(err => {
      toast.error("Hiba történt az alkalmazott törlésekor");
    });
  }

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const stats = {
    total: employees.length,
    admins: employees.filter(e => e.roles.includes("administrator")).length,
    teachers: employees.filter(e => e.roles.includes("teacher")).length,
    activeInvites: invites.length
  };

  return (
    <motion.div 
      className='max-w-screen-xl md:w-full mx-auto px-6 py-8 space-y-6'
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent rounded-lg blur-lg -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8">
          <div>
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white via-primary/80 to-white/70 bg-clip-text text-transparent">
              Alkalmazottak
            </h1>
            <p className="text-xl text-muted-foreground/90 mt-2 font-medium">Alkalmazottak kezelése és meghívók létrehozása</p>
          </div>
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild onClick={() => setSelectedInvite(null)}>
              <Button className="gap-2 text-lg py-6 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl transition-all duration-300 hover:shadow-primary/30 hover:shadow-2xl font-semibold">
                <UserPlus className="h-5 w-5" />
                Új Alkalmazott
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-effect border-white/10 shadow-xl sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Új alkalmazott meghívása</DialogTitle>
              </DialogHeader>
              {selectedInvite ? (
                <div className='flex flex-col gap-6'>
                  {selectedInvite.author?.name && (
                    <motion.div 
                      className='flex gap-4 items-center bg-white/5 p-4 rounded-lg'
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Avatar className="border-2 border-primary/30">
                        <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
                        <AvatarFallback>{getMonogram(selectedInvite.author.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-bold'>{selectedInvite.author.name}</p>
                        <p className='text-sm text-muted-foreground'>{getTopRole(selectedInvite.author.roles)}</p>
                      </div>
                      <p className='ml-auto text-sm text-muted-foreground'>{format(new Date(selectedInvite.created), "P p", {locale: hu})}</p>
                    </motion.div>
                  )}
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium">Meghívó link</label>
                    <div className="flex gap-2 items-center">
                      <Input 
                        defaultValue={`${window.location.origin}/register?invite=${selectedInvite.id.replace("invite:", "")}`} 
                        readOnly
                        className="bg-background/10 border-white/10"
                      />
                      <Button 
                        type="submit" 
                        size="icon" 
                        className="shrink-0"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/register?invite=${selectedInvite.id.replace("invite:", "")}`);
                          toast.success("Meghívó másolva a vágólapra");
                        }}
                      >
                        <span className="sr-only">másolás</span>
                        <Copy size={16} />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Oszd meg ezt a linket az új alkalmazottal a regisztrációhoz.</p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={handleInviteRemove}
                    className="w-full mt-4"
                  >
                    <Trash2 className="mr-2" size={16} />
                    Meghívó visszavonása
                  </Button>
                </div>
              ) : (
                <form className='flex flex-col gap-6' onSubmit={handleInvite}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Szerepkörök</label>
                    <MultiSelect 
                      options={Object.entries(role_map).map(e => ({label:e[1], value:e[0]}))} 
                      placeholder='Válassz Szerepkört...' 
                      className="w-full bg-background/10"
                      name="roles" 
                    />
                    <p className="text-xs text-muted-foreground">Válaszd ki a szerepköröket, amelyekkel az új alkalmazott rendelkezni fog</p>
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setInviteDialogOpen(false)}
                    >
                      Mégse
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-primary to-primary/80"
                      disabled={inviteLoading}
                    >
                      {inviteLoading && <LoaderCircle className='mr-2 animate-spin' size={16} />}
                      Meghívó létrehozása
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="glass-effect border-white/20 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent backdrop-blur-sm" />
              <CardContent className="p-4">
                <div className="flex items-center gap-4 relative min-h-[100px]">
                  <div className="p-3 rounded-lg bg-primary/20 ring-2 ring-primary/30 shadow-lg shadow-primary/20">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground font-medium truncate">Összes alkalmazott</p>
                    <p className="text-4xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="glass-effect border-white/20 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent backdrop-blur-sm" />
              <CardContent className="p-4">
                <div className="flex items-center gap-4 relative min-h-[100px]">
                  <div className="p-3 rounded-lg bg-red-500/20 ring-2 ring-red-500/30 shadow-lg shadow-red-500/20">
                    <Building2 className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground font-medium truncate">Adminisztrátorok</p>
                    <p className="text-4xl font-bold">{stats.admins}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="glass-effect border-white/20 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent backdrop-blur-sm" />
              <CardContent className="p-4">
                <div className="flex items-center gap-4 relative min-h-[100px]">
                  <div className="p-3 rounded-lg bg-emerald-500/20 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/20">
                    <GraduationCap className="h-8 w-8 text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground font-medium truncate">Tanárok</p>
                    <p className="text-4xl font-bold">{stats.teachers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="glass-effect border-white/20 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent backdrop-blur-sm" />
              <CardContent className="p-4">
                <div className="flex items-center gap-4 relative min-h-[100px]">
                  <div className="p-3 rounded-lg bg-blue-500/20 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20">
                    <Mail className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground font-medium truncate">Aktív meghívók</p>
                    <p className="text-4xl font-bold">{stats.activeInvites}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {invites.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="space-y-3"
          >
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-primary" />
              <h2 className='font-semibold'>Aktív meghívók</h2>
              <Badge className="ml-3 bg-primary/20 text-primary border-primary/20">{invites.length}</Badge>
            </div>
            <Card className="glass-effect border-white/10 overflow-hidden">
              <CardContent className="p-0">
                <ScrollArea className='pb-1 overflow-x-auto'>
                  <motion.div 
                    className='flex p-4 gap-3'
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { 
                        opacity: 1,
                        transition: { staggerChildren: 0.05 }
                      }
                    }}
                  >
                    {invites.map((invite, index) => (
                      <motion.div 
                        key={invite.id}
                        variants={{
                          hidden: { opacity: 0, scale: 0.8 },
                          visible: { 
                            opacity: 1, 
                            scale: 1,
                            transition: {
                              type: "spring",
                              stiffness: 200,
                              damping: 20,
                              delay: index * 0.05
                            }
                          }
                        }}
                      >
                        <Button 
                          variant='outline' 
                          className='flex items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all' 
                          onClick={() => {setSelectedInvite(invite);setInviteDialogOpen(true)}}
                        >
                          <span className="font-mono text-xs">{invite.id.replace("invite:", "").substring(0, 8)}...</span>
                          <SquareArrowOutUpRight size={14} />
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input 
            placeholder="Keresés név vagy email alapján..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 text-lg bg-background/10 border-white/20 focus:border-primary/40 transition-colors shadow-lg"
          />
        </div>
        <Button 
          variant="outline" 
          className="gap-2 border-white/10 bg-background/10 hover:bg-background/20"
        >
          <Filter size={16} />
          Szűrő
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="rounded-xl border-2 border-white/20 overflow-hidden glass-effect shadow-xl">
          <DataTable 
            data={filteredEmployees}
            columns={columns} 
            hideColumns={["created", "roles"]}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            rowOnClick={(v)=>navigate(v.original.id.replace("employee:", ""))}
            isLoading={isLoading}
            headerAfter={
              <div className="flex items-center gap-2">
                <AreYouSureAlert 
                  id="delete-button"
                  onConfirm={handleDelete} 
                  disabled={Object.keys(rowSelection).length === 0}
                  dialogTitle={`${Object.keys(rowSelection).length} alkalmazott törlése`}
                  dialogDescription="Biztos vagy benne, hogy törölni szeretnéd a kiválasztott alkalmazottakat? Ez a művelet nem vonható vissza."
                  confirmLabel={
                    <div className="flex items-center">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {Object.keys(rowSelection).length} alkalmazott törlése
                    </div>
                  }
                />
              </div>
            }
          />
        </div>
      </motion.div>
    </motion.div>
  );
}