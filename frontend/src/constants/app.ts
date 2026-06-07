export const APP_TITLE = 'MoneyPrinterTurbo Web UI'
export const APP_SUBTITLE = 'React + Vite + Tailwind + Chakra UI'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '') || 'http://127.0.0.1:8080'

export const SCRIPT_LANGUAGES = [
  '',
  'en-US',
  'zh-CN',
  'zh-TW',
  'zh-HK',
  'de-DE',
  'fr-FR',
  'km-KH',
  'ru-RU',
  'vi-VN',
  'th-TH',
  'tr-TR',
] as const

export const LOCALES: Record<string, string> = {
  en: 'English',
  zh: '中文',
  de: 'Deutsch',
  ru: 'Русский',
  vi: 'Tiếng Việt',
  tr: 'Türkçe',
  pt: 'Português',
  km: 'ខ្មែរ',
}
