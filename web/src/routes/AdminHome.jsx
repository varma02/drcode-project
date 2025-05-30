import React, { useEffect, useState } from 'react'
import { useAuth } from '@/lib/api/AuthProvider'
import { get, getStats } from '@/lib/api/api'
import { Album, Component, GraduationCap, LoaderCircle, MapPinned, MessageSquare, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from 'recharts'
import WorkInProgress from '@/components/WorkInProgress'

export default function AdminHome() {
  const auth = useAuth()

  const [stats, setStats] = useState(null)
  const [statsTeachers, setStatsTeachers] = useState(null)

  useEffect(() => {
    getStats(auth.token)
      .then(resp => {
        const s = resp.data
        setStats(s)
        get(auth.token, "employee", Object.keys(s.group_per_employee)).then(resp => setStatsTeachers(resp.data.employees))
      })
  }, [auth.token])
  
  if (!stats || !statsTeachers) return (
    <div className='h-screen w-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin ' />
    </div>
  )

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

  const chartData = Object.entries(stats.group_per_employee).map((e, i) => ({employee: statsTeachers.find(t => t.id == e[0]).name, groups: e[1], fill: `hsl(${i*10} 76% 61%)`}))

  const chartConfig2 = chartData.reduce((acc, { employee, fill }) => {
    acc[employee] = {
      label: employee,
      color: fill,
    }
    return acc
  }, {})

  const lessonChartData = [
    { day: "Hétfő", lesson: 186, replacement: 80 },
    { day: "Kedd", lesson: 305, replacement: 200 },
    { day: "Szerda", lesson: 237, replacement: 120 },
    { day: "Csütörtök", lesson: 73, replacement: 190 },
    { day: "Péntek", lesson: 209, replacement: 130 },
    { day: "Szombat", lesson: 214, replacement: 140 },
  ]

  const lessonChartConfig = {
    lesson: {
      label: "Óra",
      color: "var(--chart-1)",
    },
    replacement: {
      label: "Pótlás",
      color: "var(--chart-2)",
    }
  }

  return (
    <div className='size-full max-w-screen-xl mx-auto space-y-4'>
      <h1 className='text-4xl py-2'>Admin vezérlőpult</h1>
      <div className='overflow-x-auto flex gap-4 p-4 bg-primary-foreground rounded-md flex-wrap justify-center'>
        { Object.entries(stats.number_of).filter(e => e[0] in noData).map((e, i) => (
          <Link to={`/${e[0]}`} key={i} variant="outline" className="min-w-40 p-2 rounded-md border-2 border-border transition-all hover:bg-card hover:scale-105">
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
      <div className='flex gap-4 flex-col xl:flex-row'>
        <div className='bg-primary-foreground p-4 rounded-md w-full'>
          <div className='w-max mx-auto'>
            <p className='text-center text-xl'>Csoportok elosztása oktatónként</p>
            <ChartContainer
              config={chartConfig2}
              className="aspect-square max-h-[350px] h-[250px] md:h-[350px] z-50 pb-0 [&_.recharts-pie-label-text]:fill-foreground"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center" />
                <Pie data={chartData} dataKey="groups" label nameKey="employee" />
              </PieChart>
            </ChartContainer>
          </div>
        </div>
        <div className='bg-primary-foreground p-4 rounded-md w-full'>
          <p className='text-center text-xl'>Órák és pótlások a héten</p>
          <ChartContainer config={lessonChartConfig}>
            <BarChart accessibilityLayer data={lessonChartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="lesson"
                stackId="a"
                fill="#e75050"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="replacement"
                stackId="a"
                fill="#e7b550"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      <div className='bg-primary-foreground rounded-md py-10'>
        <WorkInProgress />
      </div>
    </div>
      
  )
}
