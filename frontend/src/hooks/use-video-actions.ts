import { useMutation } from '@tanstack/react-query'
import { postApi } from '../lib/api'
import { useVideoStore } from '../store/video-store'
import type { ScriptResponse, TaskCreateResponse, TermsResponse } from '../types/api'

export function useVideoActions() {
  const {
    videoSubject,
    videoScript,
    videoTerms,
    videoLanguage,
    paragraphNumber,
    setVideoScript,
    setVideoTerms,
    setTaskId,
    clearTaskId,
  } = useVideoStore()

  const generateScriptMutation = useMutation({
    mutationFn: () =>
      postApi<ScriptResponse>('/api/v1/scripts', {
        video_subject: videoSubject,
        video_language: videoLanguage,
        paragraph_number: paragraphNumber,
        video_script_prompt: '',
        custom_system_prompt: '',
      }),
    onSuccess: (payload) => {
      setVideoScript(payload.data.video_script || '')
    },
  })

  const generateTermsMutation = useMutation({
    mutationFn: () =>
      postApi<TermsResponse>('/api/v1/terms', {
        video_subject: videoSubject,
        video_script: videoScript,
        amount: 5,
      }),
    onSuccess: (payload) => {
      setVideoTerms((payload.data.video_terms || []).join(', '))
    },
  })

  const createVideoMutation = useMutation({
    mutationFn: () =>
      postApi<TaskCreateResponse>('/api/v1/videos', {
        video_subject: videoSubject,
        video_script: videoScript,
        video_terms: videoTerms,
        video_language: videoLanguage,
      }),
    onMutate: () => {
      clearTaskId()
    },
    onSuccess: (payload) => {
      setTaskId(payload.data.task_id)
    },
  })

  return {
    generateScriptMutation,
    generateTermsMutation,
    createVideoMutation,
  }
}
