import { create } from 'zustand'

export type VideoState = {
  // ── UI ──────────────────────────────────────────────────────────────────────
  locale:    string
  taskId:    string

  // ── Script ──────────────────────────────────────────────────────────────────
  videoSubject:        string
  videoScript:         string
  videoTerms:          string
  videoLanguage:       string
  paragraphNumber:     number
  videoScriptPrompt:   string
  customSystemPrompt:  string

  // ── Video ────────────────────────────────────────────────────────────────────
  videoSource:         string   // pexels | pixabay | local | douyin | bilibili | xiaohongshu
  videoAspect:         string   // 16:9 | 9:16 | 1:1
  videoConcatMode:     string   // random | sequential
  videoTransitionMode: string   // '' | Shuffle | FadeIn | FadeOut | SlideIn | SlideOut
  videoClipDuration:   number   // 2-10
  videoCount:          number   // 1-5
  videoMaterials:      { provider: string; url: string; duration: number }[]
  uploadedMaterialNames: string[]

  // ── Audio ────────────────────────────────────────────────────────────────────
  ttsServer:   string   // no-voice | azure-tts-v1 | azure-tts-v2 | siliconflow | gemini-tts | mimo-tts
  voiceName:   string
  voiceVolume: number
  voiceRate:   number
  bgmType:     string   // '' | random | custom
  bgmFile:     string
  bgmVolume:   number

  // ── Subtitle ─────────────────────────────────────────────────────────────────
  subtitleEnabled:    boolean
  subtitlePosition:   string   // top | center | bottom | custom
  customPosition:     number   // 0-100 (% from top)
  fontName:           string
  textForeColor:      string
  fontSize:           number
  strokeColor:        string
  strokeWidth:        number
  subtitleBgEnabled:  boolean
  textBgColor:        string
  roundedSubtitleBg:  boolean

  // ── Actions ───────────────────────────────────────────────────────────────────
  update: (partial: Partial<VideoState>) => void
  setTaskId:         (id: string) => void
  clearTaskId:       () => void

  // Backward-compat setters (still consumed by video-script-form)
  setLocale:          (v: string) => void
  setVideoSubject:    (v: string) => void
  setVideoScript:     (v: string) => void
  setVideoTerms:      (v: string) => void
  setVideoLanguage:   (v: string) => void
  setParagraphNumber: (v: number) => void
}

export const useVideoStore = create<VideoState>((set) => ({
  // UI
  locale: 'en',
  taskId: '',

  // Script
  videoSubject:       '',
  videoScript:        '',
  videoTerms:         '',
  videoLanguage:      '',
  paragraphNumber:    1,
  videoScriptPrompt:  '',
  customSystemPrompt: '',

  // Video
  videoSource:         'pexels',
  videoAspect:         '9:16',
  videoConcatMode:     'random',
  videoTransitionMode: '',
  videoClipDuration:   3,
  videoCount:          1,
  videoMaterials:      [],
  uploadedMaterialNames: [],

  // Audio
  ttsServer:   'azure-tts-v1',
  voiceName:   '',
  voiceVolume: 1.0,
  voiceRate:   1.0,
  bgmType:     'random',
  bgmFile:     '',
  bgmVolume:   0.2,

  // Subtitle
  subtitleEnabled:   true,
  subtitlePosition:  'bottom',
  customPosition:    70.0,
  fontName:          'STHeitiMedium.ttc',
  textForeColor:     '#FFFFFF',
  fontSize:          60,
  strokeColor:       '#000000',
  strokeWidth:       1.5,
  subtitleBgEnabled: true,
  textBgColor:       '#000000',
  roundedSubtitleBg: false,

  // Actions
  update:      (partial) => set(partial as Partial<VideoState>),
  setTaskId:   (taskId) => set({ taskId }),
  clearTaskId: () => set({ taskId: '' }),

  setLocale:          (locale)          => set({ locale }),
  setVideoSubject:    (videoSubject)    => set({ videoSubject }),
  setVideoScript:     (videoScript)     => set({ videoScript }),
  setVideoTerms:      (videoTerms)      => set({ videoTerms }),
  setVideoLanguage:   (videoLanguage)   => set({ videoLanguage }),
  setParagraphNumber: (paragraphNumber) => set({ paragraphNumber }),
}))
