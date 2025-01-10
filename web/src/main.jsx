import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider, useHref, useNavigate } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { LoaderCircle } from 'lucide-react'

import '@/index.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { AuthProvider, useAuth } from '@/lib/api/AuthProvider'
import { Toaster } from '@/components/ui/sonner'
import { CommandMenu } from './components/CommandMenu'
import { Groups } from './routes/Groups'

const Home = lazy(() => import('@/routes/Home'))
const Search = lazy(() => import('@/routes/Search'))
const CalendarPage = lazy(() => import('@/routes/CalendarPage'))
const Settings = lazy(() => import('@/routes/Settings'))
const Inbox = lazy(() => import('@/routes/Inbox'))
const Employee = lazy(() => import('@/routes/Employee'))
const EmployeeDetails = lazy(() => import('@/components/EmployeeDetails'))
const AddCalendarGroup = lazy(() => import('@/routes/AddCalendarGroup'))
const AddCalendarEvent = lazy(() => import('@/routes/AddCalendarEvent'))
const LoginPage = lazy(() => import('@/routes/Login'))
const RegisterPage = lazy(() => import('@/routes/Register'))

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
      <SidebarTrigger className="fixed top-0 p-4" />
      <AppSidebar />
      <Outlet />
      <CommandMenu />
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
      {path: "/calendar", element: <CalendarPage />},
      {path: "/search", element: <Search />},
      {path: "/settings", element: <Settings />},
      {path: "/employee/:id?", element: <Employee />},
      {path: "/calendar/add/group", element: <AddCalendarGroup />},
      {path: "/calendar/add/event", element: <AddCalendarEvent />},
      {path: "/groups", element: <Groups />},
    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
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
    <Toaster 
      expand
      richColors
      position="bottom-right"
      dir="ltr"
      closeButton
    />
  </ThemeProvider>
)
