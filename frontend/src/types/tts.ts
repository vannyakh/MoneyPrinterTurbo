import type { ApiResponse } from './api'

export type TtsServer = {
  id: string
  label: string
}

export type TtsVoice = {
  id: string
  label: string
}

export type TtsServersData = {
  servers: TtsServer[]
}

export type TtsVoicesData = {
  voices: TtsVoice[]
  default_voice: string
}

export type TtsServersResponse = ApiResponse<TtsServersData>
export type TtsVoicesResponse = ApiResponse<TtsVoicesData>

export const NO_VOICE_ID = 'no-voice'

export const TTS_SERVERS_FALLBACK: TtsServer[] = [
  { id: NO_VOICE_ID, label: 'No Voice' },
  { id: 'azure-tts-v1', label: 'Azure TTS V1' },
  { id: 'azure-tts-v2', label: 'Azure TTS V2' },
  { id: 'siliconflow', label: 'SiliconFlow TTS' },
  { id: 'gemini-tts', label: 'Google Gemini TTS' },
  { id: 'mimo-tts', label: 'Xiaomi MiMo TTS' },
]
