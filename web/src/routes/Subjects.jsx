import AreYouSureAlert from '@/components/AreYouSureAlert'
import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { getAll, remove } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { ArrowDown, ArrowUp, ArrowUpDown, Bookmark, Book, Calendar, Code2, Plus, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function Subjects() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState([])
  const [rowSelection, setRowSelection] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getAll(auth.token, 'subject').then(data => {
      setSubjects(data.data.subjects)
      setIsLoading(false)
    })
  }, [])

  function handleDelete() {
    remove(auth.token, 'subject', Object.keys(rowSelection).map(e => subjects[+e].id))
      .then(resp => {
        setSubjects(p => p.filter(e => !resp.data.subjects.includes(e.id)))
        setRowSelection({})
        toast.success("A kiválasztott kurzusok sikeresen törölve!")
      })
      .catch(() => toast.error("Hiba történt a törlés során!"))
  }

  const filteredSubjects = subjects.filter(subject =>
    subject.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: subjects.length,
    withDescription: subjects.filter(s => s.description).length,
    activeSubjects: subjects.filter(s => !s.archived).length,
  }

  const columns = [
    {
      id: "select",
      ignoreClickEvent: true,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          className="float-left"
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          className="float-left"
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
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
            : column.getIsSorted() === "asc" ? <ArrowDown className="ml-2 h-4 w-4" /> 
            : <ArrowUp className="ml-2 h-4 w-4" />}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Book className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      displayName: "Leírás",
      accessorKey: "description",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => (
        <div className="text-muted-foreground line-clamp-1">
          {row.getValue("description") || "Nincs leírás"}
        </div>
      ),
    },
    {
      displayName: "Létrehozva",
      accessorKey: "created",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(row.getValue("created")), "P", {locale: hu})}</span>
        </div>
      ),
    }
  ]

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
              Kurzusok
            </h1>
            <p className="text-xl text-muted-foreground/90 mt-2 font-medium">Programozási kurzusok kezelése és áttekintése</p>
          </div>
          <Link to="add">
            <Button className="gap-2 text-lg py-6 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl transition-all duration-300 hover:shadow-primary/30 hover:shadow-2xl font-semibold">
              <Plus className="h-5 w-5" />
              Kurzus Hozzáadása
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="glass-effect border-white/20 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent backdrop-blur-sm" />
              <CardContent className="p-6">
                <div className="flex items-center gap-6 relative">
                  <div className="p-4 rounded-xl bg-primary/20 ring-2 ring-primary/30 shadow-lg shadow-primary/20">
                    <Book className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg text-muted-foreground font-medium">Összes kurzus</p>
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
              <CardContent className="p-6">
                <div className="flex items-center gap-6 relative">
                  <div className="p-4 rounded-xl bg-blue-500/20 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20">
                    <Code2 className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-lg text-muted-foreground font-medium">Aktív kurzus</p>
                    <p className="text-4xl font-bold">{stats.activeSubjects}</p>
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
              <CardContent className="p-6">
                <div className="flex items-center gap-6 relative">
                  <div className="p-4 rounded-xl bg-green-500/20 ring-2 ring-green-500/30 shadow-lg shadow-green-500/20">
                    <Bookmark className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <p className="text-lg text-muted-foreground font-medium">Leírással</p>
                    <p className="text-4xl font-bold">{stats.withDescription}</p>
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
            placeholder="Keresés név vagy leírás alapján..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 text-lg bg-background/10 border-white/20 focus:border-primary/40 transition-colors shadow-lg"
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="rounded-xl border-2 border-white/20 overflow-hidden glass-effect shadow-xl">
          <DataTable 
            data={filteredSubjects}
            columns={columns}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            rowOnClick={(row) => navigate(`/subjects/${row.original.id.replace("subject:", "")}`)}
            isLoading={isLoading}
            headerAfter={
              <AreYouSureAlert 
                onConfirm={handleDelete} 
                disabled={Object.keys(rowSelection).length === 0}
                dialogTitle={`${Object.keys(rowSelection).length} kurzus törlése`}
                dialogDescription="Biztos vagy benne, hogy törölni szeretnéd a kiválasztott kurzusokat? Ez a művelet nem vonható vissza."
              />
            }
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
