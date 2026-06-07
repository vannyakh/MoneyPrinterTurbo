import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ColorMode = 'light' | 'dark'

type ColorModeState = {
  colorMode: ColorMode
  toggleColorMode: () => void
  setColorMode: (mode: ColorMode) => void
}

const applyColorMode = (mode: ColorMode) => {
  document.documentElement.setAttribute('data-theme', mode)
}

export const useColorModeStore = create<ColorModeState>()(
  persist(
    (set, get) => ({
      colorMode: 'dark',

      setColorMode: (mode) => {
        applyColorMode(mode)
        set({ colorMode: mode })
      },

      toggleColorMode: () => {
        const next = get().colorMode === 'dark' ? 'light' : 'dark'
        applyColorMode(next)
        set({ colorMode: next })
      },
    }),
    {
      name: 'mpt-color-mode',
      onRehydrateStorage: () => (state) => {
        if (state) applyColorMode(state.colorMode)
      },
    },
  ),
)
