import { create } from 'zustand'

import type { Platform, UserSettings } from '@/Types/types'

import { DEFAULT_SETTINGS } from '@/global/globals'

interface SettingsStore {
  settings: UserSettings
  setSettings: (settings: UserSettings) => void

  setPlatforms: (platforms: Platform[]) => void
  addPlatform: (platform: Platform) => void
  removePlatform: (platform: Platform) => void
}

export const useSettingsStore = create<SettingsStore>(set => ({
  settings: DEFAULT_SETTINGS,
  setSettings: settings => set({ settings }),
  
  setPlatforms: platforms => set(state => ({ settings: { ...state.settings, platforms } })),
  addPlatform: platform => set(state => ({ settings: { ...state.settings, platforms: [...state.settings.platforms, platform] } })),
  removePlatform: platform => set(state => ({ settings: { ...state.settings, platforms: state.settings.platforms.filter(p => p !== platform) } })),
}))
