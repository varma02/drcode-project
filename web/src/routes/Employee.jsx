import DataTable from '@/components/DataTable';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { create, getAll, remove } from '@/lib/api/api';
import { useAuth } from '@/lib/api/AuthProvider';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { ArrowDown, ArrowUp, ArrowUpDown, Copy, LoaderCircle, Plus, SquareArrowOutUpRight } from 'lucide-react';
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

export default function Employee() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([])
  const [invites, setInvites] = useState([]);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [rowSelection, setRowSelection] = useState({})

  useEffect(() => {
    getAll(auth.token, 'invite').then(i => setInvites(i.data.invites))
    getAll(auth.token, 'employee').then(e => setEmployees(e.data.employees))
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
            {!column.getIsSorted() ? <ArrowUpDown /> 
            : column.getIsSorted() === "asc" ? <ArrowDown /> : <ArrowUp />}
          </Button>
        )
      },
      cell: ({ row }) => <div className='flex items-center gap-2'>
        <Avatar className="size-12">
          <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
          <AvatarFallback className="text-4xl font-bold">{auth.user.name.split(" ").slice(0, 2).map(v => v[0]).join("")}</AvatarFallback>
        </Avatar>
        {row.getValue("name")}
      </div>,
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
            {!column.getIsSorted() ? <ArrowUpDown /> 
            : column.getIsSorted() === "asc" ? <ArrowDown /> : <ArrowUp />}
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      displayName: "Létrehozva",
      accessorKey: "created",
      header: "Létrehozva",
      cell: ({ row }) => (
        <div className="capitalize text-center">{format(new Date(row.getValue("created")), "PPP", {locale: hu} )}</div>
      ),
    },
    {
      displayName: "Szerepkör",
      accessorKey: "roles",
      header: "Szerepkör",
      cell: ({ row }) => <div className='flex gap-2'>
        {[...row.getValue("roles").map(e => <Badge key={e} className={`${e == "administrator" ? "bg-red-500" : "bg-green-500"} font-bold pointer-events-none`}>{role_map[e]}</Badge>)]}
      </div>,
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
    console.log(selectedInvite);
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
    })
  }

  return (
    <div className='max-w-screen-xl md:w-full mx-auto p-4'>
      <h1 className='text-4xl py-4'>Alkalmazottak</h1>

      {invites.length > 0 && (<>
        <h4 className='py-2'>Aktív meghívók</h4>
        <ScrollArea className='pb-2 overflow-x-auto'>
          <div className='flex w-max gap-4 pb-1'>
            {invites.map(invite => (
              <Button variant='outline' className='flex items-center gap-2' key={invite.id}
              onClick={() => {setSelectedInvite(invite);setInviteDialogOpen(true)}}>
                {invite.id.replace("invite:", "")} <SquareArrowOutUpRight />
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </>)}

      <DataTable data={employees} columns={columns} hideColumns={["created", "roles"]}
      rowSelection={rowSelection} setRowSelection={setRowSelection}
      rowOnClick={(v)=>navigate(v.original.id.replace("employee:", ""))}
      headerAfter={<div className='flex gap-4'>
        <AreYouSureAlert onConfirm={handleDelete} disabled={Object.keys(rowSelection).length == 0} />
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild onClick={() => setSelectedInvite(null)}>
            <Button variant="outline"><Plus />Meghívás</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Meghívó</DialogTitle>
            </DialogHeader>
            {selectedInvite ? (
              <div className='flex flex-col gap-4'>
                {selectedInvite.author?.name && (
                  <div className='flex gap-4 items-center'>
                    <Avatar>
                      <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
                      <AvatarFallback>{getMonogram(selectedInvite.author.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-bold'>{selectedInvite.author.name}</p>
                      <p className='text-sm opacity-70'>{getTopRole(selectedInvite.author.roles)}</p>
                    </div>
                    <p className='ml-auto text-sm opacity-70'>{format(selectedInvite.created, "P p", {locale: hu})}</p>
                  </div>
                )}
                <div className="flex gap-4">
                  <Input defaultValue={`${window.location.origin}/register?invite=${selectedInvite.id.replace("invite:", "")}`} readOnly />
                  <Button type="submit" size="icon" className="px-3" onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/register?invite=${selectedInvite.id.replace("invite:", "")}`);
                    toast.success("Meghívó másolva a vágólapra");
                  }}>
                    <span className="sr-only">másolás</span>
                    <Copy />
                  </Button>
                </div>
                <Button variant="destructive" onClick={handleInviteRemove}>Meghívó visszavonása</Button>
              </div>
            ) : (<form className='flex flex-col gap-4' onSubmit={handleInvite}>
              <MultiSelect options={Object.entries(role_map).map(e => ({label:e[1], value:e[0]}) )} placeholder='Válassz Szerepkört...' className={"w-full"} name="roles" />
              <Button type="submit" className="ml-auto" disabled={inviteLoading}>{inviteLoading && <LoaderCircle className='animate-spin ' />} Új meghívó</Button>
            </form>)}
          </DialogContent>
        </Dialog>
      </div>} />
    </div>
  )
}
