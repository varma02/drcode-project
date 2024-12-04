import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
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

const LoginPage = lazy(() => import('@/routes/Login'))

function SidebarWrapper() {
  return (
    <SidebarProvider>
      <SidebarTrigger className="absolute p-4" />
      <AppSidebar />
      <div className='p-4 min-h-screen w-full'>
        <Outlet />
      </div>
    </SidebarProvider>
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
    <Suspense fallback={
      <div className='fixed left-0 top-0 h-screen w-full bg-background flex items-center justify-center'>
        <LoaderCircle className='animate-spin ' />
      </div>
    }>
      <RouterProvider router={router} future={{v7_startTransition: true}} /* TODO: add fallback */ />
    </Suspense>
  </ThemeProvider>
)
