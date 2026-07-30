import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout/MainLayout.tsx'
import TimelinePage from './pages/TimelinePage/TimelinePage.tsx'
import CalendarPage from './pages/CalendarPage/CalendarPage.tsx'
import LoginPage from './pages/LoginPage/LoginPage.tsx'
import SignupPage from './pages/SignupPage/SignupPage.tsx'
import SettingsPage from './pages/SettingsPage/SettingsPage.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <></>,
    children: [
      {
        index: true,
        element: <App />,
        // loader: <></>
      },
      {
        path: 'timeline',
        element: <TimelinePage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
