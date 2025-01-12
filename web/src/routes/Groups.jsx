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
    Array.from(new Set(groups.map(e => e.teachers))).map(e => getEmployee(auth.token, e).then(resp => setTeachers(p => ({...p, [e]:resp.data.employee.name}))))
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
