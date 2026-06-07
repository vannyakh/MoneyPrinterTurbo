import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SettingsState = {
  apiBaseUrl: string
  pexelsApiKey: string
  pixabayApiKey: string
  llmProvider: string
  llmApiKey: string
  setApiBaseUrl: (value: string) => void
  setPexelsApiKey: (value: string) => void
  setPixabayApiKey: (value: string) => void
  setLlmProvider: (value: string) => void
  setLlmApiKey: (value: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '') || 'http://127.0.0.1:8080',
      pexelsApiKey: '',
      pixabayApiKey: '',
      llmProvider: '',
      llmApiKey: '',
      setApiBaseUrl: (apiBaseUrl) => set({ apiBaseUrl }),
      setPexelsApiKey: (pexelsApiKey) => set({ pexelsApiKey }),
      setPixabayApiKey: (pixabayApiKey) => set({ pixabayApiKey }),
      setLlmProvider: (llmProvider) => set({ llmProvider }),
      setLlmApiKey: (llmApiKey) => set({ llmApiKey }),
    }),
    { name: 'mpt-settings' },
  ),
)
