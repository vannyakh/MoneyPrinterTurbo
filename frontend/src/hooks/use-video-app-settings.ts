import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApi, putApi } from '../lib/api'
import type { VideoSettingsResponse, VideoSettingsUpdate } from '../types/video-settings-api'

const QUERY_KEY = ['video-app-settings'] as const

export function useVideoAppSettings() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getApi<VideoSettingsResponse>('/api/v1/settings/video'),
  })

  const mutation = useMutation({
    mutationFn: (body: VideoSettingsUpdate) =>
      putApi<VideoSettingsResponse>('/api/v1/settings/video', body),
    onSuccess: (payload) => {
      queryClient.setQueryData(QUERY_KEY, payload)
    },
  })

  return {
    settings: query.data?.data,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
    saveError: mutation.error,
    saveSettings: mutation.mutate,
    saveSettingsAsync: mutation.mutateAsync,
    refetch: query.refetch,
  }
}
