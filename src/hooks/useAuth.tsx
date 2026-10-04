import { onAuthStateChanged, type User } from 'firebase/auth'
import { useEffect, useState } from 'react'

import { auth } from '@/lib/firebase'
import { useDemoStore } from '@/stores/demoStore'

/**
 * Stand-in user used while demo mode is active.
 * Gives the rest of the app (guards, userId lookups, avatar, …) a real
 * user object to work with, without touching Firebase.
 */
export const DEMO_USER = {
  uid: 'demo-user',
  displayName: 'Demo Guest',
  email: 'demo@movie-calendar.local',
  photoURL: null,
} as unknown as User

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const isDemoMode = useDemoStore((state) => state.isDemoMode)

  useEffect(() => {
    if (isDemoMode) {
      setUser(DEMO_USER)
      setLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [isDemoMode])

  return { user, loading, isAuthenticated: !!user }
}

export default useAuth
