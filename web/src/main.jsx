import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider, useHref, useNavigate, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { LoaderCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import '@/index.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { AuthProvider, useAuth } from '@/lib/api/AuthProvider'
import { Toaster } from '@/components/ui/sonner'

const CommandMenu = lazy(() => import('./components/CommandMenu'))
const AdminOnlyRoute = lazy(() => import('@/components/AdminOnlyRoute'))

const Home = lazy(() => import('@/routes/Home'))
const AdminHome = lazy(() => import('@/routes/AdminHome'))
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

// Loading spinner component
const LoadingSpinner = () => (
  <div className='fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50'>
    <div className="relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <LoaderCircle className='animate-spin text-muted-foreground' size={36} />
      </div>
      <div className="h-12 w-12 rounded-full border-2 border-primary/20 animate-ping"></div>
    </div>
  </div>
);

// Page transition wrapper
const PageTransition = ({ children }) => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function SidebarWrapper() {
  const navigate = useNavigate()
  const href = useHref()
  const { authState } = useAuth()

  useEffect(() => {
    if (authState === 'no') {
      navigate("/login?redirect=" + encodeURIComponent(href))
    }
  }, [authState])

  return authState === 'yes' ? (
    <div className="h-screen w-full overflow-hidden flex bg-background">
      <SidebarProvider>
        <SidebarTrigger className="fixed top-0 p-4 z-50" />
        <AppSidebar />
        <div className="flex-1 h-screen overflow-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          <div className="container mx-auto max-w-7xl py-6">
            <Suspense fallback={<LoadingSpinner />}>
              <PageTransition>
                <Outlet />
              </PageTransition>
            </Suspense>
          </div>
        </div>
        <CommandMenu />
      </SidebarProvider>
    </div>
  ) : (
    <LoadingSpinner />
  )
}

// Card-based layouts for auth pages
const AuthLayout = ({ children }) => (
  <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="glass-effect rounded-xl overflow-hidden p-1">
        <div className="bg-card p-6 rounded-lg">
          {children}
        </div>
      </div>
    </motion.div>
  </div>
)

const router = createBrowserRouter([
  {
    path: "/",
    element: <SidebarWrapper />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/admin", element: <AdminOnlyRoute><AdminHome /></AdminOnlyRoute> },
      { path: "/worksheet", element: <Worksheet /> },
      { path: "/calendar", element: <CalendarPage /> },
      { path: "/calendar/add/event", element: <AddCalendarEvent /> },
      { path: "/helper", element: <Helper /> },
      { path: "/settings", element: <Settings /> },
      { path: "/employee", element: <Employee /> },
      { path: "/employee/:id", element: <EmployeeDetails /> },
      { path: "/groups", element: <Groups /> },
      { path: "/groups/add", element: <AddCalendarGroup /> },
      { path: "/groups/:id", element: <GroupDetails /> },
      { path: "/lessons", element: <Lessons /> },
      { path: "/lessons/add", element: <AddLesson /> },
      { path: "/lessons/:id", element: <LessonDetails /> },
      { path: "/locations", element: <Locations /> },
      { path: "/locations/add", element: <AddNewLocation /> },
      { path: "/locations/:id", element: <LocationDetails /> },
      { path: "/subjects", element: <Subjects /> },
      { path: "/subjects/add", element: <AddNewSubject /> },
      { path: "/subjects/:id", element: <SubjectDetails /> },
      { path: "/students", element: <Students /> },
      { path: "/students/add", element: <AddStudent /> },
      { path: "/students/:id", element: <StudentDetails /> },
      { path: "*", element: <NotFound /> },
    ]
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      </Suspense>
    ),
  }
])

createRoot(document.getElementById('root')).render(
  <ThemeProvider defaultTheme="dark">
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    <Toaster
      expand
      richColors
      position="bottom-right"
      dir="ltr"
      closeButton
      className="glass-effect"
      toastOptions={{
        classNames: {
          toast: "glass-effect border border-white/10",
          title: "font-medium",
          description: "text-muted-foreground text-sm"
        }
      }}
    />
  </ThemeProvider>
)
