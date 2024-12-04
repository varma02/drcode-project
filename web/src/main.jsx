import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, redirect, RouterProvider, useHref, useNavigate } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { LoaderCircle } from 'lucide-react'

import './index.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { Home } from './routes/Home'
import { Calendar } from './routes/Calendar'
import { Search } from './routes/Search'
import { Settings } from './routes/Settings'
import { Inbox } from './routes/Inbox'
import { AuthProvider, useAuth } from './lib/api/AuthProvider'
import { Toaster } from '@/components/ui/sonner'

const LoginPage = lazy(() => import('@/routes/Login'))

function SidebarWrapper() {
  const navigate = useNavigate();
  const href = useHref();
  const { authState } = useAuth();
  useEffect(() => {
    if (authState === 'no') {
      navigate("/login?redirect=" + encodeURIComponent(href))
    }
  }, [authState])
  return authState === 'yes' ? (
    <SidebarProvider>
      <SidebarTrigger className="absolute p-4" />
      <AppSidebar />
      <div className='p-4 min-h-screen w-full'>
        <Outlet />
      </div>
    </SidebarProvider>
  ) : (
    <div className='fixed left-0 top-0 h-screen w-full bg-background flex items-center justify-center'>
      <LoaderCircle className='animate-spin ' />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <SidebarWrapper />,
    children: [
      {path: "/", element: <Home />},
      {path: "/inbox", element: <Inbox />},
      {path: "/calendar", element: <Calendar />},
      {path: "/search", element: <Search />},
      {path: "/settings", element: <Settings />}
    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  }
])

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <AuthProvider>
      <Suspense fallback={
        <div className='fixed left-0 top-0 h-screen w-full bg-background flex items-center justify-center'>
          <LoaderCircle className='animate-spin ' />
        </div>
      }>
        <RouterProvider router={router} future={{v7_startTransition: true}} /* TODO: add fallback */ />
      </Suspense>
    </AuthProvider>
    <Toaster />
  </ThemeProvider>
)
