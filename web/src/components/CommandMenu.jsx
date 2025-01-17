import React, { useEffect, useRef, useState } from 'react'
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command'
import { useNavigate } from 'react-router-dom'
import { getAllEmployees, getAllGroups, getAllInvites, getAllLocations } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Combobox } from './ComboBox'

export default function CommandMenu() {
  const auth = useAuth()
  const [commandOpen, setCommandOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const commands = {
    "Navigáció": [
      {
        title: "Főoldal",
        func: (value) => navigate("/"),
      },
      {
        title: "Beosztás",
        func: (value) => navigate("/calendar"),
      },
      {
        title: "Üzenetek",
        func: (value) => navigate("/inbox"),
      },
      {
        title: "Segédletek",
        func: (value) => navigate("/search"),
      },
      {
        title: "Profil",
        func: (value) => navigate("/settings"),
      },
      {
        title: "Alkalmazottak",
        func: (value) => navigate("/employee"),
      },
      {
        title: "Csoportok",
        func: (value) => navigate("/groups"),
      },
    ],
    "Developer": [
      {
        title: "Log Groups",
        func: (value) => getAllGroups(auth.token).then(data => console.log(data.data.groups)),
      },
      {
        title: "Log Employees",
        func(value) { getAllEmployees(auth.token).then(data => console.log(data.data.employees)) },
      },
      {
        title: "Log Locations",
        func(value) { getAllLocations(auth.token).then(data => console.log(data.data.locations)) },
      },
      {
        title: "Log Invites",
        func(value) { getAllInvites(auth.token).then(data => console.log(data.data.invites)) },
      },
    ]
  }

  return (
    <>
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Írj egy parancsot vagy keress..." />
        <CommandList>
          <CommandEmpty>Nincs Találat</CommandEmpty>
          {
            Object.keys(commands).map(e =>
              <CommandGroup key={e} heading={e}>
                {
                  commands[e].map((i, id) =>
                    <CommandItem key={id} onSelect={(value) => { i.func(value); setCommandOpen(false) }}>{typeof i.title === "function" ? i.title() : i.title}</CommandItem>
                  )
                }
              </CommandGroup>
            )
          }
        </CommandList>
      </CommandDialog>
    </>
  )
}
