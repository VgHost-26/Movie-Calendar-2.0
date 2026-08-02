import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout/MainLayout.tsx'
import TimelinePage from './pages/TimelinePage/TimelinePage.tsx'
import CalendarPage from './pages/CalendarPage/CalendarPage.tsx'
import LoginPage from './pages/LoginPage/LoginPage.tsx'
import SignupPage from './pages/SignupPage/SignupPage.tsx'
import SettingsPage from './pages/SettingsPage/SettingsPage.tsx'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase.ts'
import { redirect } from 'react-router-dom'

function getCurrentUser(): Promise<typeof auth.currentUser> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

const authLoader = async () => {
  const user = await getCurrentUser();
  if (user) {
    return redirect('/timeline')
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
        element: <CalendarPage />,
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
        loader: authLoader,
        element: <LoginPage />
      },
      {
        path: 'signup',
        loader: authLoader,
        element: <SignupPage />
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
