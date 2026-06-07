import type { ApiResponse } from './api'

export type VideoMaterial = {
  provider: string
  url: string
  duration: number
}

export type VideoMaterialUploadData = {
  file: string
}

export type VideoMaterialUploadResponse = ApiResponse<VideoMaterialUploadData>

export type VideoMaterialDeleteData = {
  file: string
}

export type VideoMaterialDeleteResponse = ApiResponse<VideoMaterialDeleteData>

export const VIDEO_SOURCES = [
  { value: 'pexels',      label: 'Pexels'      },
  { value: 'pixabay',     label: 'Pixabay'     },
  { value: 'local',       label: 'Local file'  },
  { value: 'douyin',      label: 'TikTok'      },
  { value: 'bilibili',    label: 'Bilibili'    },
  { value: 'xiaohongshu', label: 'Xiaohongshu' },
] as const

export const CONCAT_MODES = [
  { value: 'sequential', label: 'Sequential' },
  { value: 'random',     label: 'Random Concatenation (Recommended)' },
] as const

export const TRANSITION_MODES = [
  { value: '',         label: 'None'     },
  { value: 'Shuffle',  label: 'Shuffle'  },
  { value: 'FadeIn',   label: 'FadeIn'   },
  { value: 'FadeOut',  label: 'FadeOut'  },
  { value: 'SlideIn',  label: 'SlideIn'  },
  { value: 'SlideOut', label: 'SlideOut' },
] as const

export const VIDEO_ASPECTS = [
  { value: '9:16', label: 'Portrait 9:16'  },
  { value: '16:9', label: 'Landscape 16:9' },
] as const

export const CLIP_DURATIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10] as const
export const VIDEO_COUNTS   = [1, 2, 3, 4, 5] as const

export const VIDEO_CODECS = [
  { value: 'libx264',           label: 'libx264 (CPU)'                        },
  { value: 'h264_nvenc',        label: 'NVIDIA NVENC (h264_nvenc)'            },
  { value: 'h264_amf',          label: 'AMD AMF (h264_amf)'                   },
  { value: 'h264_qsv',          label: 'Intel QSV (h264_qsv)'                 },
  { value: 'h264_mf',           label: 'Windows MediaFoundation (h264_mf)'    },
  { value: 'h264_videotoolbox', label: 'macOS VideoToolbox (h264_videotoolbox)' },
] as const

export const LOCAL_FILE_ACCEPT = '.mp4,.mov,.avi,.flv,.mkv,.jpg,.jpeg,.png'
