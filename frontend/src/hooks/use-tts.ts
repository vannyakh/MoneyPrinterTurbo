import { useMutation, useQuery } from '@tanstack/react-query'
import { getApi, postBlob } from '../lib/api'
import type { TtsServersResponse, TtsVoicesResponse } from '../types/tts'

export const TTS_SERVERS_KEY = ['tts', 'servers'] as const

export function useTtsServers() {
  return useQuery({
    queryKey: TTS_SERVERS_KEY,
    queryFn: () => getApi<TtsServersResponse>('/api/v1/tts/servers'),
    select: (res) => res.data.servers,
    staleTime: 60_000,
  })
}

export function useTtsVoices(
  ttsServer: string,
  locale: string,
  currentVoice: string,
) {
  return useQuery({
    queryKey: [...TTS_SERVERS_KEY, 'voices', ttsServer, locale, currentVoice],
    queryFn: () =>
      getApi<TtsVoicesResponse>('/api/v1/tts/voices', {
        tts_server: ttsServer,
        locale,
        current_voice: currentVoice,
      }),
    select: (res) => res.data,
    enabled: Boolean(ttsServer),
    staleTime: 60_000,
  })
}

export function useVoicePreview() {
  return useMutation({
    mutationFn: (body: {
      text: string
      voice_name: string
      voice_volume: number
      voice_rate: number
    }) => postBlob('/api/v1/tts/preview', body),
  })
}
