import React, { useEffect, useState } from 'react'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from './ui/chart'
import { Bar, BarChart, CartesianGrid, Label, Pie, PieChart, XAxis } from 'recharts'
import { useAuth } from '@/lib/api/AuthProvider'
import { getAll } from '@/lib/api/api'
import Employee from '@/routes/Employee'

export default function AdminDashboard() {
  const auth = useAuth()

  const [groups, setGroups] = useState(null)
  const [teacherGroups, setTeacherGroups] = useState([])

  const mapGroupsToTeachers = (groups) => {
    const map = {}
  
    groups.map((group) => {
      group.teachers.map((teacher) => {
        if (!map[teacher.id]) {
          map[teacher.id] = []
        }
        map[teacher.id].push({name: teacher.name, groups: group.id})
      })
    })
  
    return map
  }

  useEffect(() => {
    getAll(auth.token, 'group', "teachers").then(resp => {
      const groups = resp.data.groups
      setGroups(groups)
      setTeacherGroups(mapGroupsToTeachers(groups))
    })

  },[])
  console.log(groups)
  console.log(teacherGroups)

  const chartData = [
    { year: "2020", wedo: 186, scratch: 80, web: 90, unity: 100 },
    { year: "2021", wedo: 305, scratch: 200, web: 120, unity: 80 },
    { year: "2022", wedo: 237, scratch: 120, web: 100, unity: 70 },
    { year: "2023", wedo: 73, scratch: 190, web: 140, unity: 90 },
    { year: "2025", wedo: 209, scratch: 130, web: 70, unity: 100 },
    { year: "2025", wedo: 214, scratch: 140, web: 100, unity: 70 },
  ]

  const chartConfig = {
    wedo: {
      label: "WeDo",
      color: "#47b60c",
    },
    scratch: {
      label: "Scratch",
      color: "#00a38b",
    },
    web: {
      label: "Web",
      color: "#cc4800",
    },
    unity: {
      label: "Unity",
      color: "#084ac4",
    },
  }

  const chartData2 = groups?.map(e => (
    { employee: e.name, visitors: e.groups?.length || 0, fill: "var(--color-chrome)" }
  )) 
  
  const chartConfig2 = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  }

  return (
    <div>
      <ChartContainer config={chartConfig} className="h-[200px] w-[400px]">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {
            Object.keys(chartConfig).map(e => 
              <Bar key={e} dataKey={e} fill={`var(--color-${e})`} radius={4} />
            )
          }
        </BarChart>
      </ChartContainer>

      <ChartContainer
          config={chartConfig2}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData2}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
               <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 5}
                          className="fill-muted-foreground"
                        >
                          Alkalmazottak
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 15}
                          className="fill-muted-foreground"
                        >
                          heti óraszáma
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

    </div>
  )
}
