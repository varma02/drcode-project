import React, { useEffect, useState } from 'react'
import { Combobox } from './ComboBox'
import { Trash } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import { ScrollArea } from './ui/scroll-area'

export const GroupComboBox = ({data, displayName, title, placeholder = "Válassz...", className, name}) => {
  const [values, setValues] = useState([])
  const [value, setValue] = useState("")

  useEffect(() => {
    if (value == "") return
    values.push(value)
    setValue("")
  }, [value])

  return (
    <Card className={className}>
      <input type="text" name={name} defaultValue={values.join(",")} className="hidden" />
      <CardHeader className="text-center text-xl font-bold">{title}</CardHeader>
      <CardContent className="flex flex-col gap-2">
        <ScrollArea>
          <div className="flex flex-wrap gap-2">
            {
              values.map((e, i) => 
                <div className='flex gap-1' key={e}>
                  <Combobox data={data.filter(j => !values.includes(j.id) || j.id == e)} displayName={displayName} placeholder={placeholder} value={e} setValue={(v) => setValues(p => v == "" ? p.filter(e => e != p[i]) : [...values.map((val, ind) => ind == i ? v : val)])} />
                  <Button variant="outline" onClick={() => setValues(p => p.filter(x => x != e))}><Trash /></Button>
                </div>
              )
            }
            <Combobox data={data.filter(e => !values.includes(e.id))} displayName={displayName} placeholder={placeholder} value={value} setValue={setValue} />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
