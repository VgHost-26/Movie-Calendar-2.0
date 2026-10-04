import { useQueryClient } from '@tanstack/react-query'
import { signOut } from 'firebase/auth'
import { LockIcon, LogOutIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useUpdateUserSettings } from '@/api/apiFirebase'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Toggle } from '@/components/ui/toggle'
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip'
import { LANGUAGES, PLATFORMS, PLATFORMS_ICONS, POSTER_LANGUAGES } from '@/global/globals'
import useAuth from '@/hooks/useAuth'
import { auth } from '@/lib/firebase'
import { useSettingsStore } from '@/stores/settingsStore'

const SettingsPage = () => {
  const { user, loading, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const { updateUserSettings } = useUpdateUserSettings()

  const settings = useSettingsStore(state => state.settings)
  const setPlatforms = useSettingsStore(state => state.setPlatforms)
  const togglePlatform = useSettingsStore(state => state.togglePlatform)
  const { platforms = [], languageId, preferedPosterLanguage } = settings

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleTogglePlatform = (platform: (typeof PLATFORMS)[number]) => {
    togglePlatform(platform)
    setHasUnsavedChanges(true)
  }

  const handleSelectAllPlatforms = () => {
    setPlatforms([...PLATFORMS])
    setHasUnsavedChanges(true)
  }

  const handleClearPlatforms = () => {
    setPlatforms([])
    setHasUnsavedChanges(true)
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      await updateUserSettings(settings)
      toast.success('Settings saved successfully!')
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    queryClient.clear()
  }

  if (loading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading settings...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 p-window text-center">
        <h2 className="text-2xl font-bold uppercase">Access Restricted</h2>
        <p className="text-muted-foreground">Please log in to customize your settings.</p>
      </div>
    )
  }

  const username = user?.displayName || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email ?? ''

  return (
    <div className="scrollbar-hide flex h-dvh w-full flex-col overflow-y-auto">
      <div className="flex w-full max-w-3xl flex-col gap-12 p-window pb-12">
        <h1 className="text-8xl font-bold uppercase md:text-9xl">Settings</h1>

        <section className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Platforms · {platforms.length}/{PLATFORMS.length}
              </h2>
              <p className="text-sm text-muted-foreground">
                Select the streaming services you use.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button size="sm" variant="ghost" onPress={handleSelectAllPlatforms}>
                Select all
              </Button>
              <Button size="sm" variant="ghost" onPress={handleClearPlatforms}>
                Clear
              </Button>
            </div>
          </div>

          <div className="flex justify-between w-full ">
            {PLATFORMS.map(platform => (
              <TooltipTrigger key={platform} delay={300} closeDelay={0}>
                <Toggle
                  variant="outline"
                  aria-label={platform}
                  isSelected={platforms.includes(platform)}
                  onChange={() => handleTogglePlatform(platform)}
                  className="flex size-14 items-center justify-center p-2 data-[selected]:border-primary data-[selected]:bg-primary/10"
                >
                  <img src={PLATFORMS_ICONS[platform]} alt="" className="size-8 object-contain" />
                </Toggle>
                <Tooltip placement="top">
                  <p>{platform}</p>
                </Tooltip>
              </TooltipTrigger>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">
              {hasUnsavedChanges ? 'You have unsaved changes.' : 'All changes saved.'}
            </span>
            <Button isDisabled={!hasUnsavedChanges || isSaving} onPress={handleSaveSettings}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Soon
            </h2>
            <LockIcon className="size-3 text-muted-foreground" />
          </div>
          <p className="-mt-3 text-sm text-muted-foreground">Planned options, locked for now.</p>

          <div className="flex flex-col gap-1 opacity-60">
            <span className="text-sm">Interface language</span>
            <Select selectedKey={languageId} isDisabled placeholder="Select language">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang.id} id={lang.id}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1 opacity-60">
            <span className="flex items-center gap-2 text-sm">
              Poster language
              <TooltipTrigger>
                <span className="cursor-help text-xs text-muted-foreground underline decoration-dotted underline-offset-2">
                  Why?
                </span>
                <Tooltip placement="top">
                  <p>Posters show in this language when available, otherwise original.</p>
                </Tooltip>
              </TooltipTrigger>
            </span>
            <Select
              selectedKey={preferedPosterLanguage}
              isDisabled
              placeholder="Select poster language"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POSTER_LANGUAGES.map(language => (
                  <SelectItem key={language.id} id={language.id}>
                    {language.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-4 opacity-60">
            <div className="flex flex-col">
              <span className="text-sm">Theme</span>
              <span className="text-xs text-muted-foreground">Dark, light and system.</span>
            </div>
            <Badge variant="outline">Soon</Badge>
          </div>

          <div className="flex items-center justify-between gap-4 opacity-60">
            <div className="flex flex-col">
              <span className="text-sm">Release alerts</span>
              <span className="text-xs text-muted-foreground">
                Notify me when movies on my list release.
              </span>
            </div>
            <Badge variant="outline">Soon</Badge>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Account
          </h2>
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback className="font-heading text-xl text-primary">
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-lg font-semibold">{username}</span>
              {userEmail && (
                <span className="truncate text-sm text-muted-foreground">{userEmail}</span>
              )}
            </div>
            <Button variant="destructive" onPress={handleLogout} className="shrink-0">
              <LogOutIcon data-icon="inline-start" />
              Logout
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SettingsPage