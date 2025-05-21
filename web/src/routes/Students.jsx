import AreYouSureAlert from '@/components/AreYouSureAlert'
import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { getAll, remove } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { ArrowDown, ArrowUp, ArrowUpDown, Calendar, Filter, GraduationCap, MoreHorizontal, Plus, School, Search, Trash2, UserPlus, Users, Mail, Phone } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getMonogram } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export default function Students() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [rowSelection, setRowSelection] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [gradeFilter, setGradeFilter] = useState("all")
  const [grades, setGrades] = useState([])
  const [showGradeFilters, setShowGradeFilters] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getAll(auth.token, 'student')
      .then(data => {
        const studentData = data.data.students
        setStudents(studentData)
        
        const uniqueGrades = [...new Set(studentData.map(student => student.grade))]
          .filter(Boolean)
          .sort((a, b) => a - b)
        
        setGrades(uniqueGrades)
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])

  function handleDelete() {
    remove(auth.token, 'student', Object.keys(rowSelection).map(e => students[+e].id))
      .then(resp => {
        setStudents(p => p.filter(e => !resp.data.students.includes(e.id)))
        setRowSelection({})
        toast.success('A kiválasztott tanulók sikeresen törölve!')
      })
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = (
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parent?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const matchesGrade = gradeFilter === "all" || student.grade?.toString() === gradeFilter
    return matchesSearch && matchesGrade
  })

  const studentsByGrade = students.reduce((acc, student) => {
    const grade = student.grade?.toString() || "Nincs megadva"
    acc[grade] = (acc[grade] || 0) + 1
    return acc
  }, {})

  const stats = {
    total: students.length,
    withEmail: students.filter(s => s.email).length,
    withPhone: students.filter(s => s.phone).length,
    withParentInfo: students.filter(s => s.parent?.name).length
  }

  const getGradeBadgeColor = (grade) => {
    if (!grade) return "bg-muted hover:bg-muted border-muted/20 text-muted-foreground"
    
    const colors = [
      "bg-blue-500/30 hover:bg-blue-500/40 border-blue-500/20 text-blue-200",
      "bg-green-500/30 hover:bg-green-500/40 border-green-500/20 text-green-200",
      "bg-purple-500/30 hover:bg-purple-500/40 border-purple-500/20 text-purple-200",
      "bg-pink-500/30 hover:bg-pink-500/40 border-pink-500/20 text-pink-200",
      "bg-teal-500/30 hover:bg-teal-500/40 border-teal-500/20 text-teal-200",
      "bg-orange-500/30 hover:bg-orange-500/40 border-orange-500/20 text-orange-200"
    ]
    
    return colors[(grade - 1) % colors.length]
  }

  const columns = [
    {
      id: "select",
      ignoreClickEvent: true,
      header: ({ table }) => (
        <div className="flex justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            className="rounded-sm"
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            className="rounded-sm"
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      displayName: "Név",
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium px-2"
          >
            {column.columnDef.displayName}
            {!column.getIsSorted() ? <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" /> 
            : column.getIsSorted() === "asc" ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUp className="ml-2 h-4 w-4" />}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className='flex items-center gap-3'>
          <Avatar className="h-9 w-9 border border-primary/20 shadow-md">
            <AvatarImage src={null} />
            <AvatarFallback>{getMonogram(row.getValue("name"))}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.getValue("name")}</div>
        </div>
      ),
    },
    {
      accessorKey: "grade",
      displayName: "Évfolyam",
      header: ({ column }) => {
        return (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-medium"
            >
              {column.columnDef.displayName}
              {!column.getIsSorted() ? <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" /> 
              : column.getIsSorted() === "asc" ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUp className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge className={cn(
            "px-2.5 py-0.5 font-medium text-xs shadow-sm border-[0.5px]", 
            getGradeBadgeColor(row.getValue("grade"))
          )}>
            {row.getValue("grade") ? `${row.getValue("grade")}. osztály` : "Nincs megadva"}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "parent.name",
      displayName: "Szülő neve",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium px-2"
          >
            {column.columnDef.displayName}
            {!column.getIsSorted() ? <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" /> 
            : column.getIsSorted() === "asc" ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUp className="ml-2 h-4 w-4" />}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className={row.getValue("parent.name") ? "text-foreground" : "text-muted-foreground italic"}>
            {row.getValue("parent.name") || "Nincs megadva"}
          </span>
        </div>
      ),
    },
    {
      displayName: "Létrehozva",
      accessorKey: "created",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="whitespace-nowrap font-medium px-2"
          >
            {column.columnDef.displayName}
            {!column.getIsSorted() ? <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" /> 
            : column.getIsSorted() === "asc" ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUp className="ml-2 h-4 w-4" />}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{format(new Date(row.getValue("created")), "PPP", {locale: hu})}</span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 rounded-full">
                  <span className="sr-only">Menü megnyitása</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-effect">
                <DropdownMenuLabel>Műveletek</DropdownMenuLabel>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => navigate(`/students/${row.original.id.replace("student:", "")}`)}
                >
                  Részletes adatok
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-400 cursor-pointer hover:text-red-500"
                  onClick={() => {
                    const newSelection = {};
                    newSelection[row.id] = true;
                    setRowSelection(newSelection);
                    document.getElementById("delete-student-button").click();
                  }}
                >
                  Törlés
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
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
  };

  return (
    <motion.div 
      className='max-w-screen-xl md:w-full mx-auto px-6 py-8 space-y-6'
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent rounded-lg blur-lg -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8">
          <div>
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white via-primary/80 to-white/70 bg-clip-text text-transparent">
              Tanulók
            </h1>
            <p className="text-xl text-muted-foreground/90 mt-2 font-medium">Tanulók kezelése és évfolyam szerinti csoportosítása</p>
          </div>
          <Link to='add'>
            <Button className="gap-2 text-lg py-6 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl transition-all duration-300 hover:shadow-primary/30 hover:shadow-2xl font-semibold">
              <UserPlus className="h-5 w-5" />
              Új Tanuló
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <p className="text-sm text-muted-foreground font-medium truncate">Összes tanuló</p>
                    <p className="text-4xl font-bold">{stats.total}</p>
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
                    <Mail className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground font-medium truncate">E-mail címmel</p>
                    <p className="text-4xl font-bold">{stats.withEmail}</p>
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
                    <Phone className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground font-medium truncate">Telefonszámmal</p>
                    <p className="text-4xl font-bold">{stats.withPhone}</p>
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
                    <GraduationCap className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground font-medium truncate">Szülői adattal</p>
                    <p className="text-4xl font-bold">{stats.withParentInfo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input 
            placeholder="Keresés név, szülő neve vagy elérhetőség alapján..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 text-lg bg-background/10 border-white/20 focus:border-primary/40 transition-colors shadow-lg"
          />
        </div>
        <Button 
          variant="outline" 
          className="gap-2 border-white/10 bg-background/10 hover:bg-background/20"
          onClick={() => setShowGradeFilters(!showGradeFilters)}
        >
          <Filter size={16} />
          Évfolyam szűrő
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
        <Button 
          size="sm" 
          variant={gradeFilter === "all" ? "default" : "outline"}
          className={cn(
            "text-xs",
            gradeFilter === "all" 
              ? "bg-primary text-primary-foreground" 
              : "bg-white/10 hover:bg-white/20 text-foreground"
          )}
          onClick={() => setGradeFilter("all")}
        >
          Összes évfolyam
        </Button>
        {grades.map((grade) => (
          <Button
            key={grade}
            size="sm"
            variant={gradeFilter === grade.toString() ? "default" : "outline"}
            className={cn(
              "text-xs",
              gradeFilter === grade.toString() 
                ? "bg-primary text-primary-foreground" 
                : "bg-white/10 hover:bg-white/20 text-foreground"
            )}
            onClick={() => setGradeFilter(grade.toString())}
          >
            {grade}. osztály
          </Button>
        ))}
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="rounded-xl border-2 border-white/20 overflow-hidden glass-effect shadow-xl">
          <DataTable 
            data={filteredStudents}
            columns={columns}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            rowOnClick={(row) => navigate(`/students/${row.original.id.replace("student:", "")}`)}
            isLoading={isLoading}
            headerAfter={
              <AreYouSureAlert 
                id="delete-student-button"
                onConfirm={handleDelete} 
                disabled={Object.keys(rowSelection).length === 0}
                dialogTitle={`${Object.keys(rowSelection).length} tanuló törlése`}
                dialogDescription="Biztos vagy benne, hogy törölni szeretnéd a kiválasztott tanulókat? Ez a művelet nem vonható vissza."
              />
            }
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
