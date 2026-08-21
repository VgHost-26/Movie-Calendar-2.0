import { useQueryClient } from '@tanstack/react-query'
import { signOut } from 'firebase/auth'
import { InfoIcon } from 'lucide-react'
import { toast } from 'sonner'

import type { Platform } from '@/Types/types'

import { useUpdateUserSettings } from '@/api/apiFirebase'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldLabel, FieldSet } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip'
import { PLATFORMS, PLATFORMS_ICONS, POSTER_LANGUAGES } from '@/global/globals'
import useAuth from '@/hooks/useAuth'
import { auth } from '@/lib/firebase'
import { useSettingsStore } from '@/stores/settingsStore'

import pkg from '../../../package.json'

const SettingsPage = () => {
  const { user, loading, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const { updateUserSettings } = useUpdateUserSettings()

  const settings = useSettingsStore(state => state.settings)
  const setPlatforms = useSettingsStore(state => state.setPlatforms)

  const { platforms } = settings

  const handleSaveSettings = async () => {
    try {
      await updateUserSettings(settings)
      toast.success('Settings saved successfully')
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to save settings')
    }
  }

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
    <div className="flex w-full flex-col items-start gap-5">
      <Tabs defaultSelectedKey="account" className="w-full max-w-sm">
        <TabsList>
          <TabsTrigger id="account">Account</TabsTrigger>
          <TabsTrigger id="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent id="account">
          <header className="max-h-min text-lg font-semibold">Welcome, {username}!</header>
          <main className="flex h-full grow flex-col gap-5">
            <Button onPress={handleLogout}>Logout</Button>
          </main>
        </TabsContent>
        <TabsContent id="settings">
          <header className="text-lg font-semibold">Settings</header>
          <main className="flex h-full grow flex-col gap-5">
            <FieldSet>
              <Field>
                <Label>Language</Label>
                <select
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-border p-2 text-muted-foreground"
                >
                  <option>English</option>
                </select>
                <FieldDescription>
                  Language settings will be available in the future.
                </FieldDescription>
              </Field>
              <Field>
                <Label>My platforms</Label>
                <ToggleGroup
                  selectionMode="multiple"
                  variant={'outline'}
                  defaultSelectedKeys={platforms}
                  onSelectionChange={keys => setPlatforms([...keys] as Platform[])}
                >
                  {PLATFORMS.map(platform => {
                    return (
                      <ToggleGroupItem id={platform} key={platform} className={'p-0'}>
                        <img src={PLATFORMS_ICONS[platform]} className="h-6 w-6" />
                      </ToggleGroupItem>
                    )
                  })}
                </ToggleGroup>
              </Field>
              <Field>
                <div className="flex items-center gap-2">
                  <FieldLabel>Poster language</FieldLabel>
                  <TooltipTrigger>
                    <InfoIcon className="size-4 cursor-help" />
                    <Tooltip>
                      If possible poster with selected language will be shown, otherwise poster in
                      original language will be shown. "None" option will show no text at all.
                    </Tooltip>
                  </TooltipTrigger>
                </div>
                <Select
                  placeholder="Select language"
                  id="language"
                  value={settings.preferedPosterLanguage}
                  // onChange={keys => setSettings({ ...settings, preferedPosterLanguage: keys[0] })}
                  className={'min-w-37.5'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POSTER_LANGUAGES.map(language => {
                      return (
                        <SelectItem id={language.id} key={language.id}>
                          {language.name}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </Field>
              <Button onPress={handleSaveSettings}>Save</Button>
            </FieldSet>
          </main>
        </TabsContent>
      </Tabs>
      <footer className="mt-auto self-start text-muted-foreground">version: {pkg.version}</footer>
    </div>
  )
}

export default SettingsPage
