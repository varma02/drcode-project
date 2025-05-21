import { Combobox } from '@/components/ComboBox'
import { DatePicker } from '@/components/DatePicker'
import { MultiSelect } from '@/components/MultiSelect'
import { TimePicker } from '@/components/TimePicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { create, getAll } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { convertToMultiSelectData, generateLessons } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Component, MapPin, Users, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export default function AddLesson() {
  const auth = useAuth()
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [teachers, setTeachers] = useState([])
  const [selectedTeachers, setSelectedTeachers] = useState([])
  const [locations, setLocations] = useState([])
  const [groups, setGroups] = useState([])
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
    getAll(auth.token, 'employee').then(resp => setTeachers(resp.data.employees))
    getAll(auth.token, 'location').then(resp => setLocations(resp.data.locations))
    getAll(auth.token, 'group').then(resp => setGroups(resp.data.groups))
  }, [auth.token])

  function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.target)
    const lessonTime = generateLessons(formData.get("lessonDate"), 1, formData.get("start"), formData.get("end"))[0]
    const lessondata = {
      name: formData.get("name"),
      group: formData.get("group"),
      location: formData.get("location"),
      teachers: selectedTeachers.length > 0 ? selectedTeachers : ["employee:abc123"],
      ...lessonTime
    }
    create(auth.token, 'lesson', lessondata).then(
      () => { 
        toast.success("Óra sikeresen létrehozva!")
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
              Óra Hozzáadása
            </h1>
            <p className="text-muted-foreground mt-2">Új tanóra felvétele a rendszerbe</p>
          </div>
          <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-xl hidden md:flex bg-primary/10">
            <AvatarFallback className="text-2xl text-primary/70 font-bold bg-transparent">
              <BookOpen size={32} />
            </AvatarFallback>
          </Avatar>
        </div>
      </motion.div>

      <motion.form 
        variants={itemVariants} 
        className='space-y-8' 
        onSubmit={handleSubmit}
      >
        <Card className="glass-effect overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="text-primary h-5 w-5" />
              <h2 className="text-2xl font-semibold">Óra alapadatai</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Óra neve</label>
                <Input type="text" id="name" placeholder="Óra megnevezése" name="name" animated />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" /> Időpont meghatározása
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-auto">
                    <DatePicker name={"lessonDate"} date={startDate} setDate={setStartDate} />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-1">
                      <Clock size={16} className="text-muted-foreground" />
                      <TimePicker name={"start"} />
                    </div>
                    <span className="text-muted-foreground">-</span>
                    <TimePicker name={"end"} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Component className="text-primary h-5 w-5" />
              <h2 className="text-2xl font-semibold">Óra hozzárendelése</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-4 w-4" /> Oktatók kiválasztása
                </label>
                <MultiSelect 
                  options={convertToMultiSelectData(teachers, "name")} 
                  name={"teachers"} 
                  placeholder='Válassz oktatót...' 
                  className="w-full"
                  onChange={setSelectedTeachers}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
                    <Component className="h-4 w-4" /> Csoport
                  </label>
                  <Combobox 
                    data={groups} 
                    displayName={"name"} 
                    name={"group"} 
                    placeholder='Válassz csoportot...' 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-4 w-4" /> Helyszín
                  </label>
                  <Combobox 
                    data={locations} 
                    displayName={"address"} 
                    name={"location"} 
                    placeholder='Válassz helyszínt...' 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='flex gap-4 justify-end'>
          <Link to="/lessons">
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
                <Calendar className="h-4 w-4" />
                Hozzáadás
              </>
            )}
          </Button>
        </div>
      </motion.form>
    </motion.div>
  )
}
