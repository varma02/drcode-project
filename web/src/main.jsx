import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { LoaderCircle } from 'lucide-react'

import './index.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'

const LoginPage = lazy(() => import('@/routes/Login'))

function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={
        <div className='fixed left-0 top-0 h-screen w-full bg-background flex items-center justify-center'>
          <LoaderCircle className='animate-spin ' />
        </div>
      }>
        <Outlet />
      </Suspense>
    </ThemeProvider>
  )
}

function SidebarWrapper() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Outlet />
    </SidebarProvider>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/",
        element: <SidebarWrapper />,
        children: [
          // ...
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} /* TODO: add fallback */ />
)
