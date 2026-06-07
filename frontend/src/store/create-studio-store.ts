import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const STUDIO_PANEL_MIN = 320
export const STUDIO_PANEL_MAX = 640
export const STUDIO_PANEL_DEFAULT = 460

type CreateStudioState = {
  panelWidth: number
  optionsCollapsed: boolean
  setPanelWidth: (width: number) => void
  setOptionsCollapsed: (collapsed: boolean) => void
  toggleOptions: () => void
  resetPanelWidth: () => void
}

function clampWidth(width: number) {
  return Math.min(STUDIO_PANEL_MAX, Math.max(STUDIO_PANEL_MIN, Math.round(width)))
}

export const useCreateStudioStore = create<CreateStudioState>()(
  persist(
    (set) => ({
      panelWidth: STUDIO_PANEL_DEFAULT,
      optionsCollapsed: false,
      setPanelWidth: (width) => set({ panelWidth: clampWidth(width) }),
      setOptionsCollapsed: (collapsed) => set({ optionsCollapsed: collapsed }),
      toggleOptions: () => set((s) => ({ optionsCollapsed: !s.optionsCollapsed })),
      resetPanelWidth: () => set({ panelWidth: STUDIO_PANEL_DEFAULT }),
    }),
    { name: 'mpt-create-studio' },
  ),
)
