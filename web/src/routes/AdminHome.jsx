import React, { useEffect, useState } from 'react'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, Label, Pie, PieChart, XAxis, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/api/AuthProvider'
import { getAll } from '@/lib/api/api'
import { isAdmin } from '@/lib/utils'
import NotFound from './NotFound'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { BookOpen, Users, MapPin, Calendar, Download, BarChart3, UserSquare2, CalendarDays } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
}

export default function AdminHome() {
  const auth = useAuth()
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    locations: 0,
    subjects: 0,
    lessons: 0,
    groups: 0
  })

  const [chartData, setChartData] = useState([
    { year: "2020", wedo: 186, scratch: 80, web: 90, unity: 100 },
    { year: "2021", wedo: 305, scratch: 200, web: 120, unity: 80 },
    { year: "2022", wedo: 237, scratch: 120, web: 100, unity: 70 },
    { year: "2023", wedo: 73, scratch: 190, web: 140, unity: 90 },
    { year: "2024", wedo: 209, scratch: 130, web: 70, unity: 100 },
    { year: "2025", wedo: 214, scratch: 140, web: 100, unity: 70 },
  ])

  const [teacherGroups, setTeacherGroups] = useState({})
  const [chartData2, setChartData2] = useState([])

  const chartConfig = {
    wedo: {
      label: "WeDo",
      color: "hsl(var(--chart-1))",
    },
    scratch: {
      label: "Scratch",
      color: "hsl(var(--chart-2))",
    },
    web: {
      label: "Web",
      color: "hsl(var(--chart-3))",
    },
    unity: {
      label: "Unity",
      color: "hsl(var(--chart-4))",
    },
  }

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
      const mappedTeachers = mapGroupsToTeachers(groups)
      setTeacherGroups(mappedTeachers)

      setChartData2(Object.values(mappedTeachers).map((e, i) => ({
        employee: e.name,
        value: e.groups.length,
        fill: `hsl(${((i * 60) % 360)} 70% 60%)`
      })))
    })

    Promise.all([
      getAll(auth.token, 'employee'),
      getAll(auth.token, 'student'),
      getAll(auth.token, 'group'),
      getAll(auth.token, 'location'),
      getAll(auth.token, 'subject'),
      getAll(auth.token, 'lesson')
    ]).then(([employees, students, groups, locations, subjects, lessons]) => {
      setStats({
        teachers: employees.data.employees.length,
        students: students.data.students.length,
        groups: groups.data.groups.length,
        locations: locations.data.locations.length,
        subjects: subjects.data.subjects.length,
        lessons: lessons.data.lessons.length
      })
    }).catch(err => {
      console.error("Hiba történt az adatok lekérdezése közben:", err)
      toast.error("Hiba történt az adatok lekérdezése közben")
    })
  }, [auth.token])

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}. ${currentDate.toLocaleString('hu-HU', { month: 'long' })} ${currentDate.getDate()}.`;

  const exportToCSV = (data, filename) => {
    const keys = [...new Set(data.flatMap(obj => Object.keys(obj)))];
    const csvHeader = keys.join(',');

    const csvRows = data.map(obj => {
      return keys.map(key => {
        const value = obj[key] !== undefined ? obj[key] : '';
        return typeof value === 'string' && value.includes(',')
          ? `"${value}"`
          : value;
      }).join(',');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`${filename} sikeresen exportálva`);
  };

  if (!isAdmin(auth.user.roles)) {
    return <NotFound />
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-screen-xl mx-auto px-4 py-8 space-y-6"
    >
      <motion.div variants={itemVariants} className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent rounded-lg blur-lg -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8">
          <div>
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white via-primary/80 to-white/70 bg-clip-text text-transparent">
              Admin Vezérlőpult
            </h1>
            <p className="text-xl text-muted-foreground/90 mt-2 font-medium">
              Statisztikák és rendszeradatok áttekintése
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="glass-effect border-white/20 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent backdrop-blur-sm" />
              <CardContent className="p-4">
                <div className="flex items-center gap-4 relative min-h-[100px]">
                  <div className="p-3 rounded-lg bg-primary/20 ring-2 ring-primary/30 shadow-lg shadow-primary/20">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground font-medium truncate">Tanulók</p>
                    <p className="text-4xl font-bold">{stats.students}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="glass-effect border-white/20 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent backdrop-blur-sm" />
              <CardContent className="p-4">
                <div className="flex items-center gap-4 relative min-h-[100px]">
                  <div className="p-3 rounded-lg bg-blue-500/20 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20">
                    <UserSquare2 className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground font-medium truncate">Oktatók</p>
                    <p className="text-4xl font-bold">{stats.teachers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="glass-effect border-white/20 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent backdrop-blur-sm" />
              <CardContent className="p-4">
                <div className="flex items-center gap-4 relative min-h-[100px]">
                  <div className="p-3 rounded-lg bg-green-500/20 ring-2 ring-green-500/30 shadow-lg shadow-green-500/20">
                    <MapPin className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground font-medium truncate">Helyszínek</p>
                    <p className="text-4xl font-bold">{stats.locations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="glass-effect border-white/20 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent backdrop-blur-sm" />
              <CardContent className="p-4">
                <div className="flex items-center gap-4 relative min-h-[100px]">
                  <div className="p-3 rounded-lg bg-purple-500/20 ring-2 ring-purple-500/30 shadow-lg shadow-purple-500/20">
                    <BookOpen className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground font-medium truncate">Kurzusok</p>
                    <p className="text-4xl font-bold">{stats.subjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="glass-effect border-white/20 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent backdrop-blur-sm" />
              <CardContent className="p-4">
                <div className="flex items-center gap-4 relative min-h-[100px]">
                  <div className="p-3 rounded-lg bg-amber-500/20 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/20">
                    <CalendarDays className="h-8 w-8 text-amber-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground font-medium truncate">Órák</p>
                    <p className="text-4xl font-bold">{stats.lessons}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="glass-effect border-white/20 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent backdrop-blur-sm" />
              <CardContent className="p-4">
                <div className="flex items-center gap-4 relative min-h-[100px]">
                  <div className="p-3 rounded-lg bg-pink-500/20 ring-2 ring-pink-500/30 shadow-lg shadow-pink-500/20">
                    <Calendar className="h-8 w-8 text-pink-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground font-medium truncate">Csoportok</p>
                    <p className="text-4xl font-bold">{stats.groups}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle>Kurzus Beiratkozási Trendek</CardTitle>
              <CardDescription>Éves hallgatói beiratkozások kurzusonként</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart data={chartData}>
                      <CartesianGrid vertical={false} opacity={0.2} />
                      <XAxis
                        dataKey="year"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      {Object.keys(chartConfig).map(e =>
                        <Bar key={e} dataKey={e} fill={chartConfig[e].color} radius={4} />
                      )}
                    </BarChart>
                  </ChartContainer>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/10 flex justify-between">
              <p className="text-sm text-muted-foreground">Frissítve: {new Date().toLocaleDateString('hu')}</p>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => exportToCSV(chartData, 'kurzus_beiratkozas_trendek')}
              >
                <Download size={14} /> Exportálás
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle>Oktatói Csoportok Eloszlása</CardTitle>
              <CardDescription>Oktatók által vezetett csoportok száma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData2}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="employee"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    />
                    <ChartTooltip content={({active, payload}) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="p-2 bg-background border border-border rounded-md shadow-md">
                            <p className="font-medium">{payload[0].name}</p>
                            <p>{`Csoportok száma: ${payload[0].value}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/10 flex justify-between">
              <p className="text-sm text-muted-foreground">Frissítve: {new Date().toLocaleDateString('hu')}</p>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => exportToCSV(chartData2, 'tanari_csoportok_eloszlasa')}
              >
                <Download size={14} /> Exportálás
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      <motion.div variants={itemVariants}>
        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle>Gyors Műveletek</CardTitle>
            <CardDescription>Gyakori adminisztratív feladatok</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/employee" className="no-underline">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col items-center h-auto py-6 gap-3 w-full rounded-md bg-background/5 backdrop-blur-sm border border-white/10 hover:bg-background/10 transition-all text-center"
                >
                  <UserSquare2 className="h-8 w-8 text-primary" />
                  <span className="text-sm font-medium">Oktató Kezelés</span>
                </motion.div>
              </Link>

              <Link to="/students" className="no-underline">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col items-center h-auto py-6 gap-3 w-full rounded-md bg-background/5 backdrop-blur-sm border border-white/10 hover:bg-background/10 transition-all text-center"
                >
                  <Users className="h-8 w-8 text-blue-500" />
                  <span className="text-sm font-medium">Tanuló Kezelés</span>
                </motion.div>
              </Link>

              <Link to="/locations" className="no-underline">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col items-center h-auto py-6 gap-3 w-full rounded-md bg-background/5 backdrop-blur-sm border border-white/10 hover:bg-background/10 transition-all text-center"
                >
                  <MapPin className="h-8 w-8 text-green-500" />
                  <span className="text-sm font-medium">Helyszín Kezelés</span>
                </motion.div>
              </Link>

              <Link to="/subjects" className="no-underline">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col items-center h-auto py-6 gap-3 w-full rounded-md bg-background/5 backdrop-blur-sm border border-white/10 hover:bg-background/10 transition-all text-center"
                >
                  <BookOpen className="h-8 w-8 text-purple-500" />
                  <span className="text-sm font-medium">Kurzus Kezelés</span>
                </motion.div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
