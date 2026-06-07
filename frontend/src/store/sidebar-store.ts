import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SidebarState = {
  collapsed: boolean
  toggle: () => void
  setCollapsed: (v: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      collapsed: false,
      toggle: () => set({ collapsed: !get().collapsed }),
      setCollapsed: (v) => set({ collapsed: v }),
    }),
    { name: 'mpt-sidebar' },
  ),
)
