import { useQueryClient } from '@tanstack/react-query'
import { signOut } from 'firebase/auth'
import {
  GlobeIcon,
  InfoIcon,
  LockIcon,
  LogOutIcon,
  SaveIcon,
  SlidersIcon,
  SparklesIcon,
  TvIcon,
  UserIcon,
} from 'lucide-react'
import {  useState } from 'react'
import { toast } from 'sonner'

import type { Language, Platform, PosterLanguage } from '@/Types/types'

import { useUpdateUserSettings } from '@/api/apiFirebase'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldLabel, FieldSet } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip'
import { LANGUAGES, PLATFORMS, PLATFORMS_ICONS, POSTER_LANGUAGES } from '@/global/globals'
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
  const setLanguageId = useSettingsStore(state => state.setLanguageId)
  const setPreferedPosterLanguage = useSettingsStore(state => state.setPreferedPosterLanguage)

  const { platforms = [], languageId = 'en-US', preferedPosterLanguage = 'en-US' } = settings

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Track if settings differ from initial load or save
  const handlePlatformsChange = (keys: Iterable<unknown>) => {
    const updatedPlatforms = Array.from(keys) as Platform[]
    setPlatforms(updatedPlatforms)
    setHasUnsavedChanges(true)
  }

  const handleSelectAllPlatforms = () => {
    setPlatforms([...PLATFORMS])
    setHasUnsavedChanges(true)
  }

  const handleDeselectAllPlatforms = () => {
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

  // Handlers for disabled setting updates (connected to store and backend for when enabled)
  const handleUpdateLanguage = (newLanguage: Language['id']) => {
    setLanguageId(newLanguage)
    setHasUnsavedChanges(true)
  }

  const handleUpdatePosterLanguage = (newPosterLang: PosterLanguage['id']) => {
    setPreferedPosterLanguage(newPosterLang)
    setHasUnsavedChanges(true)
  }

  const handleLogout = async () => {
    await signOut(auth)
    queryClient.clear()
  }

  if (loading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center p-window text-muted-foreground">
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
        <h2 className="font-heading text-2xl font-bold uppercase">Access Restricted</h2>
        <p className="text-muted-foreground">Please log in to customize your application settings.</p>
      </div>
    )
  }

  const username = user?.displayName || user?.email?.split('@')[0] || user?.uid || 'User'
  const userEmail = user?.email || 'No email associated'

  return (
    <div className="flex h-dvh w-full flex-col overflow-y-auto bg-background p-window text-foreground scrollbar-hide">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pb-12">
        {/* Header */}
        <header className="flex flex-col gap-1 pb-2">
          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight uppercase text-white">
            SETTINGS
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your streaming subscriptions, language options, and account preferences.
          </p>
          <Separator className="mt-4 bg-border/50" />
        </header>

        {/* Main Content Tabs */}
        <Tabs defaultSelectedKey="settings" className="w-full">
          <TabsList className="mb-6 inline-flex border border-border/60 bg-muted/30 p-1">
            <TabsTrigger id="settings" className="gap-2 px-4 py-2">
              <SlidersIcon className="size-4" />
              <span>Preferences & Platforms</span>
            </TabsTrigger>
            <TabsTrigger id="account" className="gap-2 px-4 py-2">
              <UserIcon className="size-4" />
              <span>Account</span>
            </TabsTrigger>
          </TabsList>

          {/* Preferences & Platforms Tab */}
          <TabsContent id="settings" className="flex flex-col gap-6 outline-none">
            {/* My Platforms Section (Active & Editable) */}
            <Card className="border border-border/70 bg-[#121214] shadow-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <TvIcon className="size-5 text-primary" />
                    <CardTitle className="text-xl font-bold tracking-wider uppercase text-white">
                      MY PLATFORMS
                    </CardTitle>
                    <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]">
                      Active
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground">
                    Select the streaming services you use. Movies available on your platforms will be highlighted.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs px-2.5 text-muted-foreground hover:text-white"
                    onPress={handleSelectAllPlatforms}
                  >
                    Select All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs px-2.5 text-muted-foreground hover:text-white"
                    onPress={handleDeselectAllPlatforms}
                  >
                    Deselect All
                  </Button>
                </div>
              </CardHeader>
              <Separator className="bg-border/40" />

              <CardContent className="pt-6">
                <ToggleGroup
                  selectionMode="multiple"
                  variant="outline"
                  selectedKeys={platforms}
                  onSelectionChange={handlePlatformsChange}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full"
                >
                  {PLATFORMS.map(platform => {
                    const iconSrc = PLATFORMS_ICONS[platform]

                    return (
                      <ToggleGroupItem
                        key={platform}
                        id={platform}
                        aria-label={platform}
                        className="group flex h-auto w-full items-center justify-start gap-3 rounded-lg border border-border/60 bg-card/40 p-3 text-left transition-all hover:bg-card/80 hover:border-border data-[selected]:border-primary/80 data-[selected]:bg-primary/10 data-[selected]:text-foreground data-[selected]:shadow-[0_0_12px_rgba(255,180,165,0.1)] data-[selected]:ring-1 data-[selected]:ring-primary/40 cursor-pointer"
                      >
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background/60 p-1">
                          {iconSrc ? (
                            <img src={iconSrc} alt={platform} className="size-5 object-contain" />
                          ) : (
                            <TvIcon className="size-4 text-muted-foreground" />
                          )}
                        </div>
                        <span className="text-xs font-medium tracking-wide truncate flex-1 text-foreground">
                          {platform}
                        </span>
                      </ToggleGroupItem>
                    )
                  })}
                </ToggleGroup>
              </CardContent>

              <Separator className="bg-border/40 mt-4" />
              <CardFooter className="pt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {hasUnsavedChanges ? 'You have unsaved changes.' : 'All platform settings are saved.'}
                </span>
                <Button
                  isDisabled={!hasUnsavedChanges || isSaving}
                  onPress={handleSaveSettings}
                  className="gap-2 px-6 bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                >
                  <SaveIcon className="size-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
                </Button>
              </CardFooter>
            </Card>

            {/* General Preferences Section (Disabled / Coming Soon) */}
            <Card className="border border-border/70 bg-[#121214] shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <GlobeIcon className="size-5 text-muted-foreground" />
                  <CardTitle className="text-xl font-bold tracking-wider uppercase text-white">
                    GENERAL & LOCALIZATION
                  </CardTitle>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Configure language and poster options for your movie calendar.
                </CardDescription>
              </CardHeader>
              <Separator className="bg-border/40" />

              <CardContent className="pt-6">
                <FieldSet className="flex flex-col gap-6">
                  {/* Interface Language (Disabled) */}
                  <Field className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FieldLabel className="text-sm font-semibold text-foreground/80">
                          App Interface Language
                        </FieldLabel>
                      </div>
                      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] font-semibold tracking-wider uppercase">
                        Coming Soon
                      </Badge>
                    </div>

                    <div className="relative opacity-60 pointer-events-none">
                      <Select
                        placeholder="Select language"
                        id="app-language"
                        isDisabled
                        value={languageId}
                        onSelectionChange={key => {
                          const val = (String(key || 'en-US') as Language['id'])
                          handleUpdateLanguage(val)
                        }}
                        className="w-full"
                      >
                        <SelectTrigger className="w-full border-border/60 bg-card/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map(lang => (
                            <SelectItem id={lang.id} key={lang.id} value={lang.id}>
                              {lang.name} ({lang.id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FieldDescription className="text-xs text-muted-foreground/80 flex items-center gap-1.5 mt-1">
                      <LockIcon className="size-3 text-amber-400/80" />
                      App language localization is currently under development.
                    </FieldDescription>
                  </Field>

                  {/* Poster Language (Disabled) */}
                  <Field className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FieldLabel className="text-sm font-semibold text-foreground/80">
                          Preferred Poster Language
                        </FieldLabel>
                        <TooltipTrigger>
                          <InfoIcon className="size-3.5 text-muted-foreground hover:text-foreground cursor-help" />
                          <Tooltip className="max-w-xs text-xs">
                            Poster in selected language will be shown when available; otherwise the original poster will be displayed.
                          </Tooltip>
                        </TooltipTrigger>
                      </div>
                      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] font-semibold tracking-wider uppercase">
                        Coming Soon
                      </Badge>
                    </div>

                    <div className="relative opacity-60 pointer-events-none">
                      <Select
                        placeholder="Select poster language"
                        id="poster-language"
                        isDisabled
                        value={preferedPosterLanguage}
                        onSelectionChange={key => {
                          const val = (String(key || 'en-US') as PosterLanguage['id'])
                          handleUpdatePosterLanguage(val)
                        }}
                        className="w-full"
                      >
                        <SelectTrigger className="w-full border-border/60 bg-card/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {POSTER_LANGUAGES.map(language => (
                            <SelectItem id={language.id} key={language.id} value={language.id}>
                              {language.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FieldDescription className="text-xs text-muted-foreground/80 flex items-center gap-1.5 mt-1">
                      <LockIcon className="size-3 text-amber-400/80" />
                      Poster language selection will be enabled in a future release.
                    </FieldDescription>
                  </Field>
                </FieldSet>
              </CardContent>
            </Card>

            {/* Appearance & Features Section (Disabled / Coming Soon) */}
            <Card className="border border-border/70 bg-[#121214] shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="size-5 text-muted-foreground" />
                  <CardTitle className="text-xl font-bold tracking-wider uppercase text-white">
                    APPEARANCE & NOTIFICATIONS
                  </CardTitle>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Customization options and notification alerts.
                </CardDescription>
              </CardHeader>
              <Separator className="bg-border/40" />

              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Theme Mode (Disabled) */}
                  <div className="flex flex-col justify-between rounded-lg border border-border/50 bg-card/20 p-4 opacity-60">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Theme Mode</span>
                      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-[9px] uppercase">
                        Coming Soon
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      Toggle between Dark, Light, and System themes.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" isDisabled className="flex-1 text-xs cursor-not-allowed opacity-70">
                        Dark
                      </Button>
                      <Button size="sm" variant="outline" isDisabled className="flex-1 text-xs cursor-not-allowed opacity-70">
                        Light
                      </Button>
                    </div>
                  </div>

                  {/* Release Notifications (Disabled) */}
                  <div className="flex flex-col justify-between rounded-lg border border-border/50 bg-card/20 p-4 opacity-60">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Release Alerts</span>
                      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-[9px] uppercase">
                        Coming Soon
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      Receive email notifications when movies on your list release.
                    </p>
                    <div className="flex items-center justify-between rounded border border-border/40 bg-background/40 px-3 py-1.5 text-xs text-muted-foreground">
                      <span>Email Notifications</span>
                      <span className="font-mono text-[10px] uppercase text-muted-foreground/70">Disabled</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent id="account" className="flex flex-col gap-6 outline-none">
            <Card className="border border-border/70 bg-[#121214] shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <UserIcon className="size-5 text-primary" />
                  <CardTitle className="text-xl font-bold tracking-wider uppercase text-white">
                    USER PROFILE
                  </CardTitle>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Your profile and authentication details.
                </CardDescription>
              </CardHeader>
              <Separator className="bg-border/40" />

              <CardContent className="pt-6 flex flex-col gap-6">
                <div className="flex items-center gap-4 rounded-lg border border-border/60 bg-card/30 p-4">
                  <Avatar size="lg" className="size-14 border border-primary/30 bg-primary/10">
                    <AvatarFallback className="bg-primary/10 font-heading text-2xl font-bold uppercase text-primary">
                      {username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <span className="text-lg font-semibold text-white tracking-wide truncate">
                      {username}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">{userEmail}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary text-[10px]">
                        Authenticated
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Account Actions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card/20 p-3 opacity-60">
                      <span className="text-xs text-muted-foreground">Edit Profile</span>
                      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-[9px] uppercase">
                        Coming Soon
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card/20 p-3 opacity-60">
                      <span className="text-xs text-muted-foreground">Change Password</span>
                      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-[9px] uppercase">
                        Coming Soon
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t border-border/40 flex justify-end">
                <Button variant="destructive" onPress={handleLogout} className="gap-2 px-5">
                  <LogOutIcon className="size-4" />
                  <span>Logout</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-4 flex flex-col gap-2">
          <Separator className="bg-border/40" />
          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <span>Movie Calendar 2.0</span>
            <span className="font-mono text-[11px]">v{pkg.version}</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default SettingsPage



