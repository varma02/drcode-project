import { createRoot } from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import Login from './routes/Login'

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
])

createRoot(document.getElementById('root')!).render(
  <NextUIProvider>
    <RouterProvider router={router} />
  </NextUIProvider>
)
