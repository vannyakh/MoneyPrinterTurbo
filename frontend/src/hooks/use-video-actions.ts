import { useMutation } from '@tanstack/react-query'
import { postApi } from '../lib/api'
import { useVideoStore } from '../store/video-store'
import type { ScriptResponse, TaskCreateResponse, TermsResponse } from '../types/api'

export function useVideoActions() {
  const {
    // script
    videoSubject, videoScript, videoTerms, videoLanguage,
    paragraphNumber, videoScriptPrompt, customSystemPrompt,
    // video
    videoSource, videoAspect, videoConcatMode, videoTransitionMode,
    videoClipDuration, videoCount,
    // audio
    voiceName, voiceVolume, voiceRate,
    bgmType, bgmFile, bgmVolume,
    // subtitle
    subtitleEnabled, subtitlePosition, customPosition,
    fontName, textForeColor, fontSize,
    strokeColor, strokeWidth,
    subtitleBgEnabled, textBgColor, roundedSubtitleBg,
    // actions
    setVideoScript, setVideoTerms, setTaskId, clearTaskId,
  } = useVideoStore()

  const generateScriptMutation = useMutation({
    mutationFn: () =>
      postApi<ScriptResponse>('/api/v1/scripts', {
        video_subject:       videoSubject,
        video_language:      videoLanguage,
        paragraph_number:    paragraphNumber,
        video_script_prompt: videoScriptPrompt,
        custom_system_prompt: customSystemPrompt,
      }),
    onSuccess: (payload) => setVideoScript(payload.data.video_script || ''),
  })

  const generateTermsMutation = useMutation({
    mutationFn: () =>
      postApi<TermsResponse>('/api/v1/terms', {
        video_subject: videoSubject,
        video_script:  videoScript,
        amount:        5,
      }),
    onSuccess: (payload) =>
      setVideoTerms((payload.data.video_terms || []).join(', ')),
  })

  const createVideoMutation = useMutation({
    mutationFn: () =>
      postApi<TaskCreateResponse>('/api/v1/videos', {
        // Script
        video_subject:        videoSubject,
        video_script:         videoScript,
        video_terms:          videoTerms,
        video_language:       videoLanguage,
        paragraph_number:     paragraphNumber,
        video_script_prompt:  videoScriptPrompt,
        custom_system_prompt: customSystemPrompt,
        // Video
        video_source:          videoSource,
        video_aspect:          videoAspect,
        video_concat_mode:     videoConcatMode,
        video_transition_mode: videoTransitionMode || null,
        video_clip_duration:   videoClipDuration,
        video_count:           videoCount,
        // Audio
        voice_name:   voiceName,
        voice_volume: voiceVolume,
        voice_rate:   voiceRate,
        bgm_type:     bgmType,
        bgm_file:     bgmFile,
        bgm_volume:   bgmVolume,
        // Subtitle
        subtitle_enabled:           subtitleEnabled,
        subtitle_position:          subtitlePosition,
        custom_position:            customPosition,
        font_name:                  fontName,
        text_fore_color:            textForeColor,
        font_size:                  fontSize,
        stroke_color:               strokeColor,
        stroke_width:               strokeWidth,
        text_background_color:      subtitleBgEnabled ? textBgColor : false,
        rounded_subtitle_background: roundedSubtitleBg,
      }),
    onMutate:  () => clearTaskId(),
    onSuccess: (payload) => setTaskId(payload.data.task_id),
  })

  return { generateScriptMutation, generateTermsMutation, createVideoMutation }
}
