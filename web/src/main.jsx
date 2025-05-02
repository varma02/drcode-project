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
const Helper = lazy(() => import('@/routes/Helper'))
const CalendarPage = lazy(() => import('@/routes/CalendarPage'))
const Settings = lazy(() => import('@/routes/Settings'))
const Worksheet = lazy(() => import('@/routes/Worksheet'))
const Employee = lazy(() => import('@/routes/Employee'))
const EmployeeDetails = lazy(() => import('@/routes/EmployeeDetails'))
const AddCalendarGroup = lazy(() => import('@/routes/AddGroup'))
const AddCalendarEvent = lazy(() => import('@/routes/AddCalendarEvent'))
const LoginPage = lazy(() => import('@/routes/Login'))
const RegisterPage = lazy(() => import('@/routes/Register'))
const Locations = lazy(() => import('@/routes/Locations'))
const LocationDetails = lazy(() => import('@/routes/LocationDetails'))
const Groups = lazy(() => import('@/routes/Groups'))
const GroupDetails = lazy(() => import('@/routes/GroupDetails'))
const Lessons = lazy(() => import('@/routes/Lessons'))
const LessonDetails = lazy(() => import('@/routes/LessonDetails'))
const Subjects = lazy(() => import('@/routes/Subjects'))
const SubjectDetails = lazy(() => import('@/routes/SubjectDetails'))
const Students = lazy(() => import('@/routes/Students'))
const StudentDetails = lazy(() => import('@/routes/StudentDetails'))
const AddNewLocation = lazy(() => import('@/routes/AddLocation'))
const AddNewSubject = lazy(() => import('@/routes/AddSubject'))
const AddStudent = lazy(() => import('@/routes/AddStudent'))
const AddLesson = lazy(() => import('@/routes/AddLesson'))
const NotFound = lazy(() => import('@/routes/NotFound'))

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
      {path: "/worksheet", element: <Worksheet />},
      {path: "/calendar", element: <CalendarPage />},
      {path: "/helper", element: <Helper />},
      {path: "/settings", element: <Settings />},
      {path: "/employee", element: <Employee />},
      {path: "/employee/:id", element: <EmployeeDetails />},
      {path: "/calendar/add/event", element: <AddCalendarEvent />},
      {path: "/groups", element: <Groups />},
      {path: "/groups/add", element: <AddCalendarGroup />},
      {path: "/groups/:id", element: <GroupDetails />},
      {path: "/lessons", element: <Lessons />},
      {path: "/lessons/:id", element: <LessonDetails />},
      {path: "/lessons/add", element: <AddLesson />},
      {path: "/locations", element: <Locations />},
      {path: "/locations/:id", element: <LocationDetails />},
      {path: "/locations/add", element: <AddNewLocation />},
      {path: "/subjects", element: <Subjects />},
      {path: "/subjects/:id", element: <SubjectDetails />},
      {path: "/subjects/add", element: <AddNewSubject />},
      {path: "/students", element: <Students />},
      {path: "/students/add", element: <AddStudent/>},
      {path: "/students/:id", element: <StudentDetails />},
      {path: "*", element: <NotFound />},
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
