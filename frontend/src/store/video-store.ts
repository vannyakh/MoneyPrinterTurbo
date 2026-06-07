import { create } from 'zustand'

type VideoState = {
  locale: string
  videoSubject: string
  videoScript: string
  videoTerms: string
  videoLanguage: string
  paragraphNumber: number
  taskId: string
  setLocale: (locale: string) => void
  setVideoSubject: (value: string) => void
  setVideoScript: (value: string) => void
  setVideoTerms: (value: string) => void
  setVideoLanguage: (value: string) => void
  setParagraphNumber: (value: number) => void
  setTaskId: (taskId: string) => void
  clearTaskId: () => void
}

export const useVideoStore = create<VideoState>((set) => ({
  locale: 'en',
  videoSubject: '',
  videoScript: '',
  videoTerms: '',
  videoLanguage: '',
  paragraphNumber: 1,
  taskId: '',
  setLocale: (locale) => set({ locale }),
  setVideoSubject: (videoSubject) => set({ videoSubject }),
  setVideoScript: (videoScript) => set({ videoScript }),
  setVideoTerms: (videoTerms) => set({ videoTerms }),
  setVideoLanguage: (videoLanguage) => set({ videoLanguage }),
  setParagraphNumber: (paragraphNumber) => set({ paragraphNumber }),
  setTaskId: (taskId) => set({ taskId }),
  clearTaskId: () => set({ taskId: '' }),
}))
