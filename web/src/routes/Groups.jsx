import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { getAllGroups } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { Clock, MapPin, Play, User2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export const Groups = () => {
  const auth = useAuth()
  const [groups, setGroups] = useState([])

  useEffect(() => {
    getAllGroups(auth.token).then(data => setGroups(data.data.groups))
  }, [])

  console.log(groups)

  return (
    <div>
      {
        groups.map(e => 
          <Card className="w-full" key={e.id}>
            <CardHeader>{e.name}</CardHeader>
            <CardContent>
              {e.teachers.map(t => <p>{t}</p>)}
            </CardContent>
            <CardFooter>
              {e.created}
            </CardFooter>
          </Card>
        )
      }
    </div>
  )
}
