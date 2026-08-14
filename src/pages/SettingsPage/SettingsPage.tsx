import { useQueryClient } from '@tanstack/react-query'
import { signOut } from 'firebase/auth'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldSet } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
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
    <div className="flex  w-full gap-5 flex-col items-start">
      <Tabs defaultSelectedKey="account" className="w-full max-w-sm">
        <TabsList>
          <TabsTrigger id="account">Account</TabsTrigger>
          <TabsTrigger id="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent id="account">
          <header className="text-lg font-semibold max-h-min">Welcome, {username}!</header>
          <main className="flex h-full flex-col gap-5 grow">
            <Button onPress={handleLogout}>Logout</Button>
          </main>
        </TabsContent>
        <TabsContent id="settings">
          <header className="text-lg font-semibold">Settings</header>
          <main className="h-full flex flex-col gap-5 grow">
            <FieldSet>
              <Field>
                <Label>Language</Label>
                <select disabled className='w-full cursor-not-allowed rounded-lg border border-border p-2 text-muted-foreground'><option>English</option></select>
                <FieldDescription>Language settings will be available in the future.</FieldDescription>
              </Field>

            </FieldSet>
          </main>
        </TabsContent>
      </Tabs>
      <footer className="mt-auto self-start text-muted-foreground">version: {pkg.version}</footer>
    </div>
  )
}

export default SettingsPage
