import React from 'react'
import TeacherDashboard from '@/components/TeacherDashboard'
import { useAuth } from '@/lib/api/AuthProvider'
import { isAdmin } from '@/lib/utils';
import AdminDashboard from '@/components/AdminDashboard';

export default function Home() {
  const auth = useAuth();

  return (
    isAdmin(auth.user.roles) ? <AdminDashboard /> : <TeacherDashboard />
  )
}
