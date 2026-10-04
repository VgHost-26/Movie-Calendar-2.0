import { onAuthStateChanged } from 'firebase/auth'
import { StrictMode } from 'react'

import './index.css'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { redirect } from 'react-router-dom'

import MainLayout from './layouts/MainLayout/MainLayout.tsx'
import { auth } from './lib/firebase.ts'
import CalendarPage from './pages/CalendarPage/CalendarPage.tsx'
import LoginPage from './pages/LoginPage/LoginPage.tsx'
import SettingsPage from './pages/SettingsPage/SettingsPage.tsx'
import SignupPage from './pages/SignupPage/SignupPage.tsx'
import TimelinePage from './pages/TimelinePage/TimelinePage.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ArchivePage from './pages/ArchivePage/ArchivePage.tsx'

function getCurrentUser(): Promise<typeof auth.currentUser> {
  return new Promise(resolve => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe()
      resolve(user)
    })
  })
}

const authLoader = async () => {
  const user = await getCurrentUser()
  if (user) {
    return redirect('/timeline')
  }
  return null
}
const accountLoader = async (noAccount: boolean = false) => {
  const user = await getCurrentUser()
  if (!user && noAccount) {
    return redirect('/login?missingAccount=true')
  }
  if (!user) {
    return redirect('/login')
  }
  return null
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <></>,
    children: [
      {
        index: true,
        element: <TimelinePage />,
        loader: () => accountLoader(true),
      },
      {
        path: 'timeline',
        element: <TimelinePage />,
        loader: () => accountLoader(true),
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
        loader: () => accountLoader(true),
      },
      {
        path: 'archive',
        element: <ArchivePage />,
        loader: () => accountLoader(true),
      },
      {
        path: 'login',
        loader: authLoader,
        element: <LoginPage />,
      },
      {
        path: 'signup',
        loader: authLoader,
        element: <SignupPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'account',
        loader: () => accountLoader(false),
        // element: <AccountPage />,
      },
    ],
  },
])
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
