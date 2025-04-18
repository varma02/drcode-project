import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

export function Combobox({data, displayName, placeholder = "Válassz...", value, setValue, name}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <input type="text" name={name} defaultValue={value} className="hidden" />
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between overflow-x-hidden text-ellipsis"
        >
          { value ? data.find(e => e.id === value)?.[displayName] : placeholder }
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={"Keresés..."} />
          <CommandList>
            <CommandEmpty>Nincs Találat.</CommandEmpty>
            <CommandGroup>
              {data.map((e, i) => (
                <CommandItem
                  key={i}
                  value={e.id}
                  onSelect={(currentValue) => {
                    console.log(currentValue)
                    setValue(currentValue == value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === e.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {e.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
