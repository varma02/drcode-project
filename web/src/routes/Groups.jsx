import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { getAllGroups, getEmployee } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import React, { useEffect, useState } from 'react'

export const Groups = () => {
  const auth = useAuth()
  const [groups, setGroups] = useState([])
  const [teachers, setTeachers] = useState({})

  useEffect(() => {
    getAllGroups(auth.token).then(data => setGroups(data.data.groups))
  }, [])

  useEffect(() => {
    const tids = new Set()
    groups.forEach(e => e.teachers.forEach(t => tids.add(t)))
    if (tids.size === 0) return;
    getEmployee(auth.token, Array.from(tids)).then(data => {
      const temp = {}
      data.data.employees.forEach(e => temp[e.id] = e.name)
      setTeachers(temp)
    });
  }, [groups])

  return (
    <div>
      {
        groups.map(e => 
          <Card className="w-full" key={e.id}>
            <CardHeader>{e.name}</CardHeader>
            <CardContent>
              {e.teachers.map(t => <p key={t}>{teachers[t]}</p>)}
            </CardContent>
            <CardFooter>
              {format(e.created, "Pp", {locale: hu})}
            </CardFooter>
          </Card>
        )
      }
    </div>
  )
}
