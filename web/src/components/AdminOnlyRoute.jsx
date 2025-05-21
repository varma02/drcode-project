import { useAuth } from '@/lib/api/AuthProvider'
import { isAdmin } from '@/lib/utils'
import NotFound from '@/routes/NotFound'
import React from 'react'

export default function AdminOnlyRoute({ children }) {
  const auth = useAuth()

  if (!isAdmin(auth.user.roles)) return <NotFound />
  return children
}
