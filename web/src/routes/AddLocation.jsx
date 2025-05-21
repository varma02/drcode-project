import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { create } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ArrowLeft, Building2, Mail, MapPin, Phone } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function AddNewLocation() {
  const auth = useAuth()
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

  function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.target)
    create(auth.token, 'location', {
      name: formData.get("name"), 
      address: formData.get("address"), 
      contact_email: formData.get("contact_email"), 
      contact_phone: formData.get("contact_phone")
    }).then(
      () => { 
        toast.success("Helyszín sikeresen létrehozva!")
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
              Helyszín Hozzáadása
            </h1>
            <p className="text-muted-foreground mt-2">Új oktatási helyszín felvétele a rendszerbe</p>
          </div>
          <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-xl hidden md:flex bg-primary/10">
            <AvatarFallback className="text-2xl text-primary/70 font-bold bg-transparent">
              <Building2 size={32} />
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
              <MapPin className="text-primary h-5 w-5" />
              <h2 className="text-2xl font-semibold">Helyszín adatai</h2>
            </div>
            <div className="space-y-6">
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Név</label>
                  <Input type="text" id="name" placeholder="Helyszín neve" name="name" animated />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium text-muted-foreground">Cím</label>
                  <Input type="text" id="address" placeholder="Helyszín címe" name="address" animated />
                </div>
              </div>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className="space-y-2">
                  <label htmlFor="contact_email" className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" /> Kapcsolattartói email
                  </label>
                  <Input type="email" id="contact_email" placeholder="kapcsolat@pelda.hu" name="contact_email" animated />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact_phone" className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> Kapcsolattartói telefonszám
                  </label>
                  <Input type="tel" id="contact_phone" placeholder="+36 XX XXX XXXX" name="contact_phone" animated />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='flex gap-4 justify-end'>
          <Link to="/locations">
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
                <MapPin className="h-4 w-4" />
                Hozzáadás
              </>
            )}
          </Button>
        </div>
      </motion.form>
    </motion.div>
  )
}