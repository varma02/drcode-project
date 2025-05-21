import AreYouSureAlert from '@/components/AreYouSureAlert'
import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { get, getAll, remove } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { ArrowDown, ArrowUp, ArrowUpDown, Filter, Plus, Search, Users2, School, Calendar, MapPin, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function Groups() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [rowSelection, setRowSelection] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getAll(auth.token, 'group', "teachers")
      .then(data => {
        setGroups(data.data.groups)
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        toast.error("Hiba történt a csoportok betöltése közben")
        setIsLoading(false)
      })
  }, [])

  function handleDelete() {
    remove(auth.token, 'group', Object.keys(rowSelection).map(e => groups[+e].id))
      .then(resp => {
        setGroups(p => p.filter(e => !resp.data.groups.includes(e.id)))
        setRowSelection({})
        toast.success(`${Object.keys(rowSelection).length} csoport sikeresen törölve`)
      })
      .catch(err => {
        toast.error("Hiba történt a csoportok törlése közben")
      })
  }

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.location?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.teachers?.some(teacher => teacher.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const stats = {
    total: groups.length,
    activeGroups: groups.filter(g => !g.archived).length,
    uniqueLocations: new Set(groups.map(g => g.location?.name).filter(Boolean)).size,
    uniqueTeachers: new Set(groups.flatMap(g => g.teachers?.map(t => t.name) || [])).size
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
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      displayName: "Helyszín",
      accessorKey: "location",
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
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("location")?.name || "N/A"}</span>
        </div>
      ),
    },
    {
      displayName: "Oktatók",
      accessorKey: "teachers",
      header: ({ column }) => column.columnDef.displayName,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("teachers")?.map(e => e.name).join(", ") || "N/A"}</span>
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
              Csoportok
            </h1>
            <p className="text-xl text-muted-foreground/90 mt-2 font-medium">
              Csoportok kezelése és áttekintése
            </p>
          </div>
          <Link to="add">
            <Button className="gap-2 text-lg py-6 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl transition-all duration-300 hover:shadow-primary/30 hover:shadow-2xl font-semibold">
              <Plus className="h-5 w-5" />
              Új Csoport
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
                    <Users2 className="h-8 w-8 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground font-medium truncate">Összes csoport</p>
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
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent backdrop-blur-sm" />
              <CardContent className="p-4">
                <div className="flex items-center gap-4 relative min-h-[100px]">
                  <div className="p-3 rounded-lg bg-green-500/20 ring-2 ring-green-500/30 shadow-lg shadow-green-500/20">
                    <Calendar className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground font-medium truncate">Aktív csoportok</p>
                    <p className="text-4xl font-bold">{stats.activeGroups}</p>
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
                    <MapPin className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground font-medium truncate">Helyszínek</p>
                    <p className="text-4xl font-bold">{stats.uniqueLocations}</p>
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
                    <p className="text-sm text-muted-foreground font-medium truncate">Oktatók</p>
                    <p className="text-4xl font-bold">{stats.uniqueTeachers}</p>
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
            placeholder="Keresés név, helyszín vagy oktató alapján..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 text-lg bg-background/10 border-white/20 focus:border-primary/40 transition-colors shadow-lg"
          />
        </div>
        <Button 
          variant="outline" 
          className="gap-2 border-white/10 bg-background/10 hover:bg-background/20"
        >
          <Filter size={16} />
          Szűrő
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="rounded-xl border-2 border-white/20 overflow-hidden glass-effect shadow-xl">
          <DataTable 
            data={filteredGroups}
            columns={columns}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            rowOnClick={(row) => navigate(row.original.id.replace("group:", ""))}
            isLoading={isLoading}
            headerAfter={
              <div className="flex items-center gap-2">
                <AreYouSureAlert 
                  id="delete-button"
                  onConfirm={handleDelete} 
                  disabled={Object.keys(rowSelection).length === 0}
                  dialogTitle={`${Object.keys(rowSelection).length} csoport törlése`}
                  dialogDescription="Biztos vagy benne, hogy törölni szeretnéd a kiválasztott csoportokat? Ez a művelet nem vonható vissza."
                  confirmLabel={
                    <div className="flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      {Object.keys(rowSelection).length} csoport törlése
                    </div>
                  }
                />
              </div>
            }
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
