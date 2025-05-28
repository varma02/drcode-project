import React, { useEffect, useState } from 'react'
import { useAuth } from '@/lib/api/AuthProvider'
import { getAll, getStats } from '@/lib/api/api'
import { Album, Component, GraduationCap, LoaderCircle, MapPinned, MessageSquare, User } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Pie, PieChart } from 'recharts'

export default function AdminHome() {
  const auth = useAuth()

  const [teacherGroups, setTeacherGroups] = useState([])
  const [stats, setStats] = useState(null)

  const mapGroupsToTeachers = (groups) => {
    const map = {}
  
    groups.map((group) => {
      group.teachers.map((teacher) => {
        if (!map[teacher.id]) {
          map[teacher.id] = {
            name: teacher.name,
            groups: []
          }
        }
        map[teacher.id].groups.push(group.id)
      })
    })
  
    return map
  }

  useEffect(() => {
    getAll(auth.token, 'group', "teachers").then(resp => {
      const groups = resp.data.groups
      setTeacherGroups(mapGroupsToTeachers(groups))
    })
    
    getStats(auth.token).then(resp => setStats(resp.data))
  }, [auth.token])

  
  if (!stats) return (
    <div className='h-screen w-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin ' />
    </div>
  )

  console.log(stats)

  const iconIsze = 48

  const noData = {
    employees: {
      name: "Alkalmazott",
      icon: <User size={iconIsze} />
    },
    groups: {
      name: "Csoport",
      icon: <Component size={iconIsze} />
    },
    invites: {
      name: "Meghívó",
      icon: <MessageSquare size={iconIsze} />
    },
    locations: {
      name: "Helyszín",
      icon: <MapPinned size={iconIsze} />
    },
    students: {
      name: "Tanuló",
      icon: <GraduationCap size={iconIsze} />
    },
    subjects: {
      name: "Kurzus",
      icon: <Album size={iconIsze} />
    },
  }

  if (!stats) return (
    <div className='h-screen w-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin' />
    </div>
  )

  const chartData = Object.entries(stats.group_per_employee).map((e, i) => ({employee: e[0], groups: e[1], fill: `hsl(${i*10} 76% 61%)`}))
  
  const chartConfig = {...chartData.map((e, i) => (
    {[e.employee]: {label:e.employee, color:`hsl(${i*10} 76% 61%)`}}
  ))}


  return (
    <div className='size-full bg-primary-foreground p-4 rounded-xl flex flex-1 flex-col'>
      <div className='max-w-screen-xl md:w-full mx-auto p-4 space-y-4'>
        <div className='w-full grid grid-cols-3 gap-2 xl:flex'>
          { Object.entries(stats.number_of).filter(e => e[0] in noData).map((e, i) => (
            <Link to={`/${e[0]}`} key={i} variant="outline" className="w-full h-max p-2 rounded-md border-2 border-border transition-all hover:bg-card hover:scale-105">
              <div className='flex gap-2 size-full items-center'>
                {noData[e[0]].icon}
                <div>
                  <b className='text-2xl'>{e[1]}</b>
                  <p>{noData[e[0]].name}</p>
                </div>
              </div>
            </Link>
            ))
          }
        </div>

        <div>
          <p className='mb-2'>Óraadások folyamata ({stats.number_of.lessons.past} a {stats.number_of.lessons.total}-ből)</p>
          <div className='flex items-center gap-2'>
            <p>0</p>
            <Progress value={stats.number_of.lessons.past / stats.number_of.lessons.total * 100} />
            <p>{stats.number_of.lessons.total}</p>
          </div>
        </div>
        
        <div className="flex gap-4 justify-between">
          <div>
            <h3 className='text-3xl'>Bevétel</h3>
            <div>
              <p>Összesen: <b className='text-green-500'>{stats.income.total} HUF</b></p>
              <p>Ma: <b className='text-green-500'>{stats.income.today} HUF</b></p>
              <p>Héten: <b className='text-green-500'>{stats.income.this_week} HUF</b></p>
              <p>Hónapban: <b className='text-green-500'>{stats.income.this_month} HUF</b></p>
            </div>
          </div>
          <div>
            <h3 className='text-3xl'>Dolgozott órák</h3>
            <div>
              <p>Összesen: {stats.worked_hours.total}</p>
              <p>Ma: {stats.worked_hours.today}</p>
              <p>Héten: {stats.worked_hours.this_week}</p>
              <p>Hónapban: {stats.worked_hours.this_month}</p>
            </div>
          </div>
        </div>
        
        <div>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] z-50 pb-0 [&_.recharts-pie-label-text]:fill-foreground"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="groups" label nameKey="employee" />
            </PieChart>
          </ChartContainer>
        </div>

      </div>
    </div>
  )
}
