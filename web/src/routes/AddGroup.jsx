import { Combobox } from '@/components/ComboBox'
import { DatePicker } from '@/components/DatePicker'
import { MultiSelect } from '@/components/MultiSelect'
import { TimePicker } from '@/components/TimePicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { create, getAll } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { convertToMultiSelectData, generateLessons } from '@/lib/utils'
import { Label } from '@radix-ui/react-label'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Component, MapPin, Users, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export default function AddCalendarGroup() {
  const auth = useAuth()

  const [employees, setEmployees] = useState([])
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date(new Date().setHours(new Date().getHours() + 1)))
  const [location, setLocation] = useState("")
  const [locations, setLocations] = useState([])
  const [generateToggle, setGenerateToggle] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
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
        stiffness: 260,
        damping: 20
      }
    }
  }
  
  useEffect(() => {
    getAll(auth.token, 'employee').then(e => setEmployees(e.data.employees))
    getAll(auth.token, 'location').then(data => setLocations(data.data.locations))
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.target)
    const lessons = generateToggle ? generateLessons(formData.get("startDate"), formData.get("lessonNum"), formData.get("startTime"), formData.get("endTime")) : undefined
    const groupData = {
      name: formData.get("name"),
      location: formData.get("location"),
      teachers: formData.get("employees").split(","),
      lessons
    }
    create(auth.token, 'group', groupData).then(
      () => { 
        toast.success("Csoport sikeresen létrehozva!")
        setIsSubmitting(false)
      },
      (error) => { 
        setIsSubmitting(false)
        switch (error.response?.data?.code) {
          case "fields_required":
            return toast.error("Valamelyik mező üres!")
          case "unauthorized":
            return toast.error("Ehhez hincs jogosultsága!")
          default:
            return toast.error("Ismeretlen hiba történt!")
        }
      }
    )
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-screen-xl mx-auto p-4 sm:p-6 space-y-8"
    >
      <motion.div variants={itemVariants} className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent rounded-lg blur-lg -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-primary/80 to-white/70 bg-clip-text text-transparent">
              Csoport Hozzáadása
            </h1>
            <p className="text-muted-foreground mt-2">Új oktatási csoport felvétele a rendszerbe</p>
          </div>
          <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-xl hidden md:flex bg-primary/10">
            <AvatarFallback className="text-2xl text-primary/70 font-bold bg-transparent">
              <Users size={32} />
            </AvatarFallback>
          </Avatar>
        </div>
      </motion.div>

      <motion.form 
        variants={itemVariants} 
        className='space-y-8' 
        onSubmit={handleSubmit}
        autoComplete='off'
      >
        <Card className="glass-effect overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Component className="text-primary h-5 w-5" />
              <h2 className="text-2xl font-semibold">Csoport alapadatai</h2>
            </div>
            <div className="space-y-6">
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Csoport neve</label>
                  <Input type="text" id="name" placeholder="Csoport megnevezése" name="name" animated />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-4 w-4" /> Helyszín
                  </label>
                  <Combobox 
                    data={locations} 
                    displayName={"name"} 
                    placeholder='Válassz helyszínt...'
                    value={location}
                    setValue={setLocation}
                    className={"w-full"} 
                    name="location" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-4 w-4" /> Oktatók kiválasztása
                </label>
                <MultiSelect 
                  options={convertToMultiSelectData(employees)} 
                  name={"employees"} 
                  placeholder='Válassz oktatót...' 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="text-primary h-5 w-5" />
                <h2 className="text-2xl font-semibold">Órák generálása</h2>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  id="generate-toggle" 
                  checked={generateToggle}
                  onCheckedChange={(e) => setGenerateToggle(e)} 
                />
                <label htmlFor="generate-toggle" className="text-sm font-medium text-muted-foreground cursor-pointer">
                  {generateToggle ? 'Bekapcsolva' : 'Kikapcsolva'}
                </label>
              </div>
            </div>
            
            {generateToggle && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-4 w-4" /> Első óra dátuma
                    </label>
                    <DatePicker date={startDate} setDate={setStartDate} name="startDate" required />
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" /> Időintervallum
                    </label>
                    <div className="flex items-center gap-2">
                      <TimePicker date={startDate} setDate={setStartDate} name="startTime" className="flex-1" />
                      <span className="text-muted-foreground">-</span>
                      <TimePicker date={endDate} setDate={setEndDate} name="endTime" className="flex-1" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lessonNum" className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
                      <Plus className="h-4 w-4" /> Óraszám
                    </label>
                    <Input 
                      type="number" 
                      id="lessonNum"
                      min={1} 
                      name="lessonNum" 
                      placeholder="például: 12" 
                      className="w-32"
                      animated
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <div className='flex gap-4 justify-end'>
          <Link to="/groups">
            <Button variant="outline" className="min-w-28 gap-2" type="button">
              <ArrowLeft className="h-4 w-4" /> Vissza
            </Button>
          </Link>
          <Button 
            className="min-w-28 gap-2" 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v2" />
                  </svg>
                </span>
                Feldolgozás...
              </>
            ) : (
              <>
                <Users className="h-4 w-4" />
                Hozzáadás
              </>
            )}
          </Button>
        </div>
      </motion.form>
    </motion.div>
  )
}
