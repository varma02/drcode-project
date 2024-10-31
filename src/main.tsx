import { createRoot } from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'
import { createBrowserRouter, Outlet, RouterProvider, useHref, useNavigate } from 'react-router-dom'
import './index.css'

import Login from './routes/Login'
import Dashboard from './routes/Dashboard'
import ForgotPass from './routes/ForgotPass'
import Error from './routes/Error'
import ThemeProvider from './components/ThemeProvider'
import Calendar from './routes/Calendar'
import Sidebar from './components/Sidebar'

function App() {
  const navigate = useNavigate();
  return (
    <ThemeProvider>
      <NextUIProvider useHref={useHref} navigate={(to:string)=>{console.log("asdf");navigate(to)}}>
        <Outlet />
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
