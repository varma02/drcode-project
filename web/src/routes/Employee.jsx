import DataTable from '@/components/DataTable';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { createInvite, getAllEmployees, getAllInvites, removeInvite } from '@/lib/api/api';
import { useAuth } from '@/lib/api/AuthProvider';
import { format, set } from 'date-fns';
import { hu } from 'date-fns/locale';
import { ArrowDown, ArrowUp, ArrowUpDown, Copy, LoaderCircle, Plus, SquareArrowOutUpRight, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getMonogram, getTopRole, role_map } from '@/lib/utils';
import { GroupComboBox } from '@/components/GroupComboBox';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function Employee() {
  const auth = useAuth();

  const [employees, setEmployees] = useState([])

  const [invites, setInvites] = useState([]);
  const [selectedInvite, setSelectedInvite] = useState(null);

  useEffect(() => {
    getAllInvites(auth.token).then(i => setInvites(i.data.invites))
    getAllEmployees(auth.token).then(e => setEmployees(e.data.employees))
  }, [])
  
  const columns = [
    {
      id: "select",
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
    const roles = formdata.get("roles").split(",");
    createInvite(auth.token, roles).then((v) => {
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
    removeInvite(auth.token, selectedInvite.id).then((v) => {
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

  return (
    <div className='max-w-screen-xl md:w-full mx-auto p-4'>
      <h1 className='text-4xl py-4'>Alkalmazottak</h1>

      {invites.length > 0 && (<>
        <h4 className='py-2'>Aktív meghívók</h4>
        <ScrollArea className='pb-2 overflow-x-auto'>
          <div className='flex w-max gap-4 pb-1'>
            {invites.map(invite => (
              <Card key={invite.id} className="flex flex-row p-2 gap-2 items-center">
                <p className='text-base'>
                  {invite.id.replace("invite:", "")}
                </p>
                <Button variant="outline" size="icon" onClick={() => {setSelectedInvite(invite);setInviteDialogOpen(true)}}>
                  <SquareArrowOutUpRight />
                </Button>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </>)}

      <DataTable data={employees} columns={columns}
      headerAfter={<div className='flex gap-4 pl-4'>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="hover:bg-destructive">
              <Trash /> Törlés
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Biztosan tötölni szeretné?</AlertDialogTitle>
              <AlertDialogDescription>
                Ezzel az alkalmazottal kapcsolatos minden adat törlődik. Ezt a műveletet nem lehet visszavonni.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Mégse</AlertDialogCancel>
              <AlertDialogAction variant="destructive">Törlés</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
                {selectedInvite.author.name && (
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
              <GroupComboBox data={Object.entries(role_map).map(v => ({id: v[0], name:v[1]}))} displayName={"name"} placeholder='Válassz Szerepkört...' title={"Szerepkörök"} className={"w-full"} name="roles" />
                <Button type="submit" className="ml-auto" disabled={inviteLoading}>{inviteLoading && <LoaderCircle className='animate-spin ' />} Új meghívó</Button>
            </form>)}
          </DialogContent>
        </Dialog>
      </div>} />
    </div>
  )
}
