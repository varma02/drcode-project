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

const CommandMenu = lazy(() => import('./components/CommandMenu'))

const Home = lazy(() => import('@/routes/Home'))
const Search = lazy(() => import('@/routes/Search'))
const CalendarPage = lazy(() => import('@/routes/CalendarPage'))
const Settings = lazy(() => import('@/routes/Settings'))
const Inbox = lazy(() => import('@/routes/Inbox'))
const Employee = lazy(() => import('@/routes/Employee'))
const EmployeeDetails = lazy(() => import('@/routes/EmployeeDetails'))
const AddCalendarGroup = lazy(() => import('@/routes/AddGroup'))
const AddCalendarEvent = lazy(() => import('@/routes/AddCalendarEvent'))
const LoginPage = lazy(() => import('@/routes/Login'))
const RegisterPage = lazy(() => import('@/routes/Register'))
const Locations = lazy(() => import('@/routes/Locations'))
const Groups = lazy(() => import('@/routes/Groups'))
const GroupDetails = lazy(() => import('@/routes/GroupDetails'))
const Subjects = lazy(() => import('@/routes/Subjects'))
const Students = lazy(() => import('@/routes/Students'))
const StudentDetails = lazy(() => import('@/routes/StudentDetails'))


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
      <Suspense fallback={
        <div className='h-screen w-full bg-background flex items-center justify-center'>
          <LoaderCircle className='animate-spin ' />
        </div>
      }>
        <Outlet />
      </Suspense>
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
      {path: "/inbox/:id?", element: <Inbox />},
      {path: "/calendar", element: <CalendarPage />},
      {path: "/search", element: <Search />},
      {path: "/settings", element: <Settings />},
      {path: "/employee", element: <Employee />},
      {path: "/employee/:id", element: <EmployeeDetails />},
      {path: "/calendar/add/event", element: <AddCalendarEvent />},
      {path: "/groups", element: <Groups />},
      {path: "/groups/add", element: <AddCalendarGroup />},
      {path: "/groups/:id", element: <GroupDetails />},
      {path: "/locations", element: <Locations />},
      {path: "/subjects", element: <Subjects />},
      {path: "/students", element: <Students />},
      {path: "/students/:id", element: <StudentDetails />},
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
        <RouterProvider router={router} />
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
