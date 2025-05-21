import React, { useEffect, useState } from 'react'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, Label, Pie, PieChart, XAxis } from 'recharts'
import { useAuth } from '@/lib/api/AuthProvider'
import { getAll } from '@/lib/api/api'

export default function AdminHome() {
  const auth = useAuth()

  const [teacherGroups, setTeacherGroups] = useState([])

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

  }, [])

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

  const chartData3 = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
  ]
  
  const chartConfig3 = {
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
  
  const chartData2 = Object.values(teacherGroups).map((e, i) => (
    {employee: e.name, groups: e.groups.length, fill: `hsl(${10*i} 76% 61%)`}
  ))

  const chartConfig2 = Object.values(teacherGroups).map(e => (
    {[e.name]: {label: e.name, color: "hsl(var(--chart-5))"}}
  ))

  return (
    <div className='size-full bg-primary-foreground p-4 rounded-xl flex flex-1 flex-col'>
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
          config={{}}
          className="aspect-square max-h-[250px] w-max"
        >
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={chartData2}
            dataKey="groups"
            nameKey="employee"
            innerRadius={60}
            strokeWidth={5}
          >
            <ChartLegend
              content={<ChartLegendContent nameKey="employee" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
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
                      className="fill-foreground font-bold"
                    >
                      Alkalmazottak
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 15}
                      className="fill-muted-foreground"
                    >
                      csoportszáma
                    </tspan>
                  </text>
                )
              }
            }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      {/* <ChartContainer
          config={chartConfig2}
          className="aspect-square max-h-[300px] w-max"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData2} dataKey="groups" nameKey={"employee"} innerRadius={60} />
          </PieChart>
        </ChartContainer> */}

    </div>
  )
}
