import { useQueryClient } from '@tanstack/react-query'
import { signOut } from 'firebase/auth'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useAuth from '@/hooks/useAuth'
import { auth } from '@/lib/firebase'

import pkg from '../../../package.json'

const SettingsPage = () => {
  const { user, loading, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const handleLogout = async () => {
    await signOut(auth)
    queryClient.clear()
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
      <header>Settings</header>
      <Tabs defaultSelectedKey="account" className="">
        <TabsList>
          <TabsTrigger id="account">Account</TabsTrigger>
          <TabsTrigger id="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent id="account">
          <div className="text-lg font-semibold">Welcome, {username}!</div>
          <Button onPress={handleLogout}>Logout</Button>
        </TabsContent>
        <TabsContent id="settings">
          <div className="text-lg font-semibold">Settings</div>
          <div>
            <p>Coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
      <footer>version: {pkg.version}</footer>
    </div>
  )
}

export default SettingsPage
