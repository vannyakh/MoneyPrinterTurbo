import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Field,
  HStack,
  Input,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Volume2 } from 'lucide-react'
import { CustomAudioPlayer } from './custom-audio-player'
import { useTtsServers, useTtsVoices, useVoicePreview } from '../../hooks/use-tts'
import { useVideoStore } from '../../store/video-store'
import { NO_VOICE_ID, TTS_SERVERS_FALLBACK } from '../../types/tts'
import { FieldMenuSelect, MenuSelect, numberOptions } from './menu-select'
import { inputStyle, labelStyle } from '../../lib/field-styles'

const VOICE_VOLUMES = [0.6, 0.8, 1.0, 1.2, 1.5, 2.0, 3.0, 4.0, 5.0] as const
const VOICE_RATES = [0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.5, 1.8, 2.0] as const
const BGM_VOLUMES = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] as const

const BGM_OPTIONS = [
  { value: '', label: 'No Background Music' },
  { value: 'random', label: 'Random Background Music' },
  { value: 'custom', label: 'Custom Background Music' },
]

type AudioSettingsSectionProps = {
  inputStyle?: typeof inputStyle
  labelStyle?: typeof labelStyle
}

export function AudioSettingsSection({
  inputStyle: inputSx = inputStyle,
  labelStyle: labelSx = labelStyle,
}: AudioSettingsSectionProps) {
  const {
    locale,
    videoSubject,
    videoScript,
    ttsServer,
    voiceName,
    voiceVolume,
    voiceRate,
    bgmType,
    bgmFile,
    bgmVolume,
    update,
  } = useVideoStore()

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState('')

  const { data: servers = TTS_SERVERS_FALLBACK, isLoading: serversLoading } = useTtsServers()
  const { data: voicesData, isLoading: voicesLoading, isError: voicesError } = useTtsVoices(
    ttsServer,
    locale,
    voiceName,
  )

  const voicePreview = useVoicePreview()
  const voices = voicesData?.voices ?? []
  const isNoVoice = ttsServer === NO_VOICE_ID

  const serverOptions = useMemo(
    () => servers.map((s) => ({ value: s.id, label: s.label })),
    [servers],
  )

  const voiceOptions = useMemo(
    () => voices.map((v) => ({ value: v.id, label: v.label })),
    [voices],
  )

  useEffect(() => {
    if (!voicesData || voices.length === 0) return

    const validIds = voices.map((v) => v.id)
    if (voiceName && validIds.includes(voiceName)) return

    const nextVoice = voicesData.default_voice || validIds[0] || ''
    if (nextVoice && nextVoice !== voiceName) {
      update({ voiceName: nextVoice })
    }
  }, [voicesData, voices, voiceName, update])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handlePlayVoice = async () => {
    if (isNoVoice || !voiceName) return

    setPreviewError('')
    const text = videoSubject.trim() || videoScript.trim() || 'Voice Example'

    try {
      const blob = await voicePreview.mutateAsync({
        text,
        voice_name: voiceName,
        voice_volume: voiceVolume,
        voice_rate: voiceRate,
      })

      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(blob))
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : 'Voice preview failed')
    }
  }

  return (
    <Stack gap={4}>
      <FieldMenuSelect
        label="TTS Servers"
        labelStyle={labelSx}
        options={serverOptions}
        value={ttsServer}
        onChange={(v) => update({ ttsServer: v })}
        disabled={serversLoading}
        placeholder="Select TTS server…"
      />

      <Field.Root>
        <Field.Label {...labelSx}>Speech Synthesis Voice</Field.Label>
        {voicesLoading ? (
          <HStack gap={2} py={2}>
            <Spinner size="xs" color="blue.500" />
            <Text fontSize="xs" color="text.muted">Loading voices…</Text>
          </HStack>
        ) : voicesError || voices.length === 0 ? (
          <Box
            px={3}
            py={2.5}
            borderRadius="input"
            border="1px solid"
            borderColor="border.error"
            bg="bg.error"
          >
            <Text fontSize="xs" fontWeight="600" color="text.error">
              No voices available for the selected TTS server. Please select another server.
            </Text>
          </Box>
        ) : (
          <MenuSelect
            options={voiceOptions}
            value={voiceName}
            onChange={(v) => update({ voiceName: v })}
            placeholder="Select voice…"
          />
        )}
      </Field.Root>

      {!isNoVoice && voices.length > 0 && (
        <Box>
          <Button
            variant="outline"
            borderRadius="btn"
            fontWeight="700"
            size="sm"
            onClick={handlePlayVoice}
            disabled={voicePreview.isPending || !voiceName}
            gap={2}
          >
            {voicePreview.isPending ? <Spinner size="xs" /> : <Volume2 size={14} />}
            Play Voice
          </Button>

          {previewUrl && (
            <Box mt={3}>
              <CustomAudioPlayer src={previewUrl} autoPlay />
            </Box>
          )}

          {previewError && (
            <Text mt={2} fontSize="xs" fontWeight="600" color="text.error">
              {previewError}
            </Text>
          )}
        </Box>
      )}

      <FieldMenuSelect
        label="Speech Volume (1.0 represents 100%)"
        labelStyle={labelSx}
        options={numberOptions(VOICE_VOLUMES)}
        value={String(voiceVolume)}
        onChange={(v) => update({ voiceVolume: Number(v) })}
      />

      <FieldMenuSelect
        label="Speech Rate (1.0 means 1x speed)"
        labelStyle={labelSx}
        options={numberOptions(VOICE_RATES)}
        value={String(voiceRate)}
        onChange={(v) => update({ voiceRate: Number(v) })}
      />

      <FieldMenuSelect
        label="Background Music"
        labelStyle={labelSx}
        options={BGM_OPTIONS}
        value={bgmType}
        onChange={(v) => update({ bgmType: v })}
      />

      {bgmType === 'custom' && (
        <Field.Root>
          <Field.Label {...labelSx}>Custom Background Music File</Field.Label>
          <Input
            {...inputSx}
            value={bgmFile}
            onChange={(e) => update({ bgmFile: e.target.value })}
            placeholder="output013.mp3"
            fontFamily="mono"
            fontSize="xs"
          />
          <Field.HelperText fontSize="xs" color="text.muted">
            Enter a filename from the server songs directory, e.g. output013.mp3
          </Field.HelperText>
        </Field.Root>
      )}

      <FieldMenuSelect
        label="Background Music Volume (0.2 represents 20%, background music should not be too loud)"
        labelStyle={labelSx}
        options={numberOptions(BGM_VOLUMES)}
        value={String(bgmVolume)}
        onChange={(v) => update({ bgmVolume: Number(v) })}
      />
    </Stack>
  )
}
