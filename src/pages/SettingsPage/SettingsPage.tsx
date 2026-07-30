import useAuth from '@/hooks/useAuth'

const SettingsPage = () => {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <div>Please log in to access the settings page.</div>
  }

  const username = user?.displayName || user?.email || user?.uid
  return <div className="text-lg font-semibold">Welcome, {username}!</div>
}

export default SettingsPage
