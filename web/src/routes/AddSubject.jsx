import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { create } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function AddNewSubject() {
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
    create(auth.token, 'subject', { name: formData.get("name"), description: formData.get("description") }).then(
      () => { 
        toast.success("Kurzus sikeresen létrehozva!")
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
              Kurzus Hozzáadása
            </h1>
            <p className="text-muted-foreground mt-2">Új oktatási kurzus felvétele a rendszerbe</p>
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
              <h2 className="text-2xl font-semibold">Kurzus adatai</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Kurzus neve</label>
                <Input type="text" id="name" placeholder="Kurzus megnevezése" name="name" animated />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
                  <FileText className="h-4 w-4" /> Kurzus leírása
                </label>
                <Textarea 
                  id="description"
                  placeholder="Részletes leírás a kurzusról..." 
                  name="description"
                  className="min-h-32 resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='flex gap-4 justify-end'>
          <Link to="/subjects">
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
                <BookOpen className="h-4 w-4" />
                Hozzáadás
              </>
            )}
          </Button>
        </div>
      </motion.form>
    </motion.div>
  )
}
