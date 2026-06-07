import { useMutation } from '@tanstack/react-query'
import { deleteApi, uploadFormData } from '../lib/api'
import type { VideoMaterialDeleteResponse, VideoMaterialUploadResponse } from '../types/video-settings'

export function useUploadVideoMaterial() {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return uploadFormData<VideoMaterialUploadResponse>('/api/v1/video_materials', formData)
    },
  })
}

export function useDeleteVideoMaterial() {
  return useMutation({
    mutationFn: (filename: string) =>
      deleteApi<VideoMaterialDeleteResponse>(
        `/api/v1/video_materials?file=${encodeURIComponent(filename)}`,
      ),
  })
}
