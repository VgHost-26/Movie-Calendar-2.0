import { create } from 'zustand'

import type { Language, Platform, PosterLanguage, UserSettings } from '@/Types/types'

import { DEFAULT_SETTINGS } from '@/global/globals'

interface SettingsStore {
  settings: UserSettings
  setSettings: (settings: UserSettings) => void

  setPlatforms: (platforms: Platform[]) => void
  togglePlatform: (platform: Platform) => void
  addPlatform: (platform: Platform) => void
  removePlatform: (platform: Platform) => void

  setLanguageId: (languageId: Language['id']) => void
  setPreferedPosterLanguage: (posterLanguageId: PosterLanguage['id']) => void
}

export const useSettingsStore = create<SettingsStore>(set => ({
  settings: DEFAULT_SETTINGS,
  setSettings: settings => set({ settings }),

  setPlatforms: platforms => set(state => ({ settings: { ...state.settings, platforms } })),
  togglePlatform: platform =>
    set(state => {
      const exists = state.settings.platforms.includes(platform)
      const platforms = exists
        ? state.settings.platforms.filter(p => p !== platform)
        : [...state.settings.platforms, platform]
      return { settings: { ...state.settings, platforms } }
    }),
  addPlatform: platform =>
    set(state => ({
      settings: {
        ...state.settings,
        platforms: state.settings.platforms.includes(platform)
          ? state.settings.platforms
          : [...state.settings.platforms, platform],
      },
    })),
  removePlatform: platform =>
    set(state => ({
      settings: {
        ...state.settings,
        platforms: state.settings.platforms.filter(p => p !== platform),
      },
    })),

  setLanguageId: languageId =>
    set(state => ({ settings: { ...state.settings, languageId } })),
  setPreferedPosterLanguage: preferedPosterLanguage =>
    set(state => ({ settings: { ...state.settings, preferedPosterLanguage } })),
}))

