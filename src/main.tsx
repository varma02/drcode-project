import { createRoot } from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom'
import './index.css'

import Login from './routes/Login'
import Dashboard from './routes/Dashboard'
import ForgotPass from './routes/ForgotPass'
import Error from './routes/Error'

const router = createBrowserRouter([
  { 
    path: '/login', 
    element: <Login />,
    errorElement: <Error />,
  },
  { 
    path: '/login/forgot-password', 
    element: <ForgotPass />,
    errorElement: <Error />,
  },
  { 
    path: '/',
    element: <Dashboard />,
    errorElement: <Error />,
    // loader: async () => {
    //   // TODO: check if user is logged in
    //   if (true) {
    //     return redirect('/login')
    //   }
    // },
  },
])

createRoot(document.getElementById('root')!).render(
  <NextUIProvider>
    <RouterProvider router={router} />
  </NextUIProvider>
)
