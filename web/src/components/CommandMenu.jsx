import React, { useEffect, useState } from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/lib/api/AuthProvider'
import { DialogDescription, DialogTitle } from './ui/dialog'
import { endpoints, getAll } from '@/lib/api/api'

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
        func: (value) => navigate("/employees"),
      },
      {
        title: "Csoportok",
        func: (value) => navigate("/groups"),
      },
    ],
    "Developer": [
      ...endpoints.filter(e => !["auth", "file"].includes(e)).map(e => (
        {
          title: "Log " + e.charAt(0).toUpperCase() + e.substring(1).toLowerCase() + "s",
          func: (value) => getAll(auth.token, e).then(resp => console.log(resp.data[e+"s"])),
        }
      )),
      {
        title: "Copy Auth Token",
        func: (value) => navigator.clipboard.writeText(auth.token),
      },
    ]
  }

  return (
    <>
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
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