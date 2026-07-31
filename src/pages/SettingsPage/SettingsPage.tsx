import useAuth from '@/hooks/useAuth'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'

const SettingsPage = () => {
  const { user, loading, isAuthenticated } = useAuth()
  const handleLogout = () => {
    signOut(auth)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <div>Please log in to access the settings page.</div>
  }

  const username = user?.displayName || user?.email || user?.uid
  return (
    <div>
      <div className="text-lg font-semibold">Welcome, {username}!</div>
      <Button onPress={handleLogout}>Logout</Button>
    </div>
  )
}

export default SettingsPage
