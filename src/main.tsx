import { createRoot } from 'react-dom/client'
import { NextUIProvider, Spinner } from '@nextui-org/react'
import { createBrowserRouter, Outlet, RouterProvider, useHref, useNavigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import './index.css'
import ThemeProvider from './components/ThemeProvider'

const Calendar = lazy(() => import('./routes/Calendar'));
const Sidebar = lazy(() => import('./components/Sidebar'));
const Login = lazy(() => import('./routes/Login'));
const ForgotPass = lazy(() => import('./routes/ForgotPass'));
const Dashboard = lazy(() => import('./routes/Dashboard'));
const Error = lazy(() => import('./routes/Error'));

function App() {
  const navigate = useNavigate();
  return (
    <ThemeProvider>
      <NextUIProvider useHref={useHref} navigate={(to:string)=>{console.log("asdf");navigate(to)}}>
        <Suspense fallback={<Spinner label="Betöltés..." color="primary" />}>
          <Outlet />
        </Suspense>
      </NextUIProvider>
    </ThemeProvider>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      { 
        path: '/login', 
        element: <Login />,
      },
      { 
        path: '/login/forgot-password', 
        element: <ForgotPass />,
      },
      { 
        path: '/',
        element: <Sidebar />,
        loader: async () => {
          // TODO: check if user is logged in
          if (true) {
            return null // redirect('/login')
          }
        },
        children: [
          { 
            path: '/',
            element: <Dashboard />,
          },
          {
            path: '/calendar',
            element: <Calendar />,
          }
        ],
      },
    ]
  }
], {})

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
