import type { ApiResponse } from './api'

export type VideoCodecOption = {
  value: string
  label: string
}

export type VideoSettingsData = {
  video_codec: string
  video_source: string
  codec_options: VideoCodecOption[]
}

export type VideoSettingsResponse = ApiResponse<VideoSettingsData>

export type VideoSettingsUpdate = {
  video_codec?: string
  video_source?: string
}

export const VIDEO_ENCODER_HELP =
  'Advanced option. libx264 is the safest default. When a hardware encoder is selected, the app falls back to libx264 if the current FFmpeg, GPU, or driver cannot use it.'
