import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Field,
  HStack,
  IconButton,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Trash2, Upload } from 'lucide-react'
import { useVideoAppSettings } from '../../hooks/use-video-app-settings'
import { useDeleteVideoMaterial, useUploadVideoMaterial } from '../../hooks/use-video-materials'
import { useVideoStore } from '../../store/video-store'
import {
  CLIP_DURATIONS,
  CONCAT_MODES,
  LOCAL_FILE_ACCEPT,
  TRANSITION_MODES,
  VIDEO_ASPECTS,
  VIDEO_CODECS,
  VIDEO_COUNTS,
  VIDEO_SOURCES,
} from '../../types/video-settings'
import { VIDEO_ENCODER_HELP } from '../../types/video-settings-api'
import { FieldMenuSelect, MenuSelect, numberOptions } from './menu-select'
import { Tooltip } from './tooltip'

const labelStyle = { fontWeight: '700', color: 'text.primary', fontSize: 'sm' } as const

type VideoSettingsSectionProps = {
  labelStyle?: typeof labelStyle
}

export function VideoSettingsSection({
  labelStyle: labelSx = labelStyle,
}: VideoSettingsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const hydratedRef = useRef(false)

  const {
    videoSource,
    videoConcatMode,
    videoTransitionMode,
    videoAspect,
    videoClipDuration,
    videoCount,
    videoMaterials,
    uploadedMaterialNames,
    update,
  } = useVideoStore()

  const { settings, isLoading, isSaving, saveSettings } = useVideoAppSettings()
  const uploadMutation = useUploadVideoMaterial()
  const deleteMutation = useDeleteVideoMaterial()

  const sourceOptions = useMemo(() => [...VIDEO_SOURCES], [])
  const concatOptions = useMemo(() => [...CONCAT_MODES], [])
  const transitionOptions = useMemo(() => [...TRANSITION_MODES], [])
  const aspectOptions = useMemo(() => [...VIDEO_ASPECTS], [])
  const codecOptions = useMemo(
    () => settings?.codec_options ?? [...VIDEO_CODECS],
    [settings?.codec_options],
  )

  const videoCodec = settings?.video_codec ?? 'libx264'

  // Hydrate video source from server config (Main.py: config.app["video_source"])
  useEffect(() => {
    if (!settings || hydratedRef.current) return
    hydratedRef.current = true
    if (settings.video_source && settings.video_source !== videoSource) {
      update({ videoSource: settings.video_source })
    }
  }, [settings, update, videoSource])

  const persistVideoSource = (value: string) => {
    update({ videoSource: value })
    saveSettings({ video_source: value })
  }

  const persistVideoCodec = (value: string) => {
    saveSettings({ video_codec: value })
  }

  const handleLocalFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setUploadError('')

    const uploaded: typeof videoMaterials = []
    const names: string[] = []

    for (const file of Array.from(files)) {
      try {
        const res = await uploadMutation.mutateAsync(file)
        const filename = res.data.file
        uploaded.push({ provider: 'local', url: filename, duration: 0 })
        names.push(filename)
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : 'Upload failed')
        return
      }
    }

    update({
      videoMaterials: uploaded,
      uploadedMaterialNames: names,
    })
  }

  const handleDeleteMaterial = async (name: string) => {
    setUploadError('')
    try {
      await deleteMutation.mutateAsync(name)
      update({
        videoMaterials: videoMaterials.filter((m) => m.url !== name),
        uploadedMaterialNames: uploadedMaterialNames.filter((n) => n !== name),
      })
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Delete failed')
    }
  }

  return (
    <Stack gap={4}>
      <FieldMenuSelect
        label="Video Source"
        labelStyle={labelSx}
        options={sourceOptions}
        value={videoSource}
        onChange={persistVideoSource}
        disabled={isLoading}
      />

      {videoSource === 'local' && (
        <Field.Root>
          <Field.Label {...labelSx}>Upload Local Files</Field.Label>
          <input
            ref={fileInputRef}
            type="file"
            accept={LOCAL_FILE_ACCEPT}
            multiple
            hidden
            onChange={(e) => {
              void handleLocalFiles(e.target.files)
              e.target.value = ''
            }}
          />
          <Box
            asChild
            w="full"
            borderRadius="input"
            border="1px dashed"
            borderColor="border.default"
            bg="bg.subtle"
            color="text.secondary"
            fontWeight="600"
            fontSize="sm"
            cursor="pointer"
            _hover={{ borderColor: 'blue.500', color: 'text.primary' }}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '10px 16px',
                background: 'transparent',
                border: 'none',
              }}
            >
              {uploadMutation.isPending ? <Spinner size="xs" /> : <Upload size={15} />}
              Upload
            </button>
          </Box>
          <Field.HelperText fontSize="xs" color="text.muted">
            200MB per file · MP4, MOV, AVI, FLV, MKV, JPG, JPEG, PNG
          </Field.HelperText>

          {uploadedMaterialNames.length > 0 && (
            <Stack gap={1} mt={1}>
              {uploadedMaterialNames.map((name) => (
                <HStack key={name} justify="space-between" gap={2}>
                  <Text fontSize="xs" fontFamily="mono" color="text.secondary" truncate flex={1}>
                    {name}
                  </Text>
                  <IconButton
                    aria-label={`Delete ${name}`}
                    size="xs"
                    variant="ghost"
                    colorPalette="red"
                    borderRadius="nav"
                    disabled={deleteMutation.isPending}
                    onClick={() => void handleDeleteMaterial(name)}
                  >
                    <Trash2 size={12} />
                  </IconButton>
                </HStack>
              ))}
            </Stack>
          )}

          {uploadError && (
            <Text fontSize="xs" fontWeight="600" color="text.error" mt={1}>
              {uploadError}
            </Text>
          )}
        </Field.Root>
      )}

      <FieldMenuSelect
        label="Video Concat Mode"
        labelStyle={labelSx}
        options={concatOptions}
        value={videoConcatMode}
        onChange={(v) => update({ videoConcatMode: v })}
      />

      <FieldMenuSelect
        label="Video Transition Mode"
        labelStyle={labelSx}
        options={transitionOptions}
        value={videoTransitionMode}
        onChange={(v) => update({ videoTransitionMode: v })}
      />

      <FieldMenuSelect
        label="Video Ratio"
        labelStyle={labelSx}
        options={aspectOptions}
        value={videoAspect}
        onChange={(v) => update({ videoAspect: v })}
      />

      <FieldMenuSelect
        label="Clip Duration"
        labelStyle={labelSx}
        options={numberOptions(CLIP_DURATIONS)}
        value={String(videoClipDuration)}
        onChange={(v) => update({ videoClipDuration: Number(v) })}
      />

      <FieldMenuSelect
        label="Number of Videos Generated Simultaneously"
        labelStyle={labelSx}
        options={numberOptions(VIDEO_COUNTS)}
        value={String(videoCount)}
        onChange={(v) => update({ videoCount: Number(v) })}
      />

      <Box borderTop="1px solid" borderColor="border.default" pt={3}>
        <HStack
          asChild
          w="full"
          justify="space-between"
          align="center"
          py={1}
          cursor="pointer"
          _hover={{ opacity: 0.85 }}
        >
          <button type="button" onClick={() => setShowAdvanced((v) => !v)}>
            <Text fontWeight="700" fontSize="sm" color="text.primary">
              Advanced Video Settings
            </Text>
            <motion.div
              animate={{ rotate: showAdvanced ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex' }}
            >
              <ChevronDown size={14} className="text-slate-400" />
            </motion.div>
          </button>
        </HStack>

        <AnimatePresence initial={false}>
          {showAdvanced && (
            <motion.div
              key="adv-video"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <Box pt={4}>
                <Field.Root>
                  <HStack gap={1.5} mb={1}>
                    <Field.Label {...labelSx} mb={0}>Video Encoder</Field.Label>
                    <Tooltip content={VIDEO_ENCODER_HELP}>
                      <Text
                        as="span"
                        fontSize="xs"
                        color="text.muted"
                        cursor="help"
                        userSelect="none"
                        aria-label="Video encoder help"
                      >
                        ?
                      </Text>
                    </Tooltip>
                    {isSaving && <Spinner size="xs" />}
                  </HStack>
                  <MenuSelect
                    options={codecOptions}
                    value={videoCodec}
                    onChange={persistVideoCodec}
                    placeholder="Select encoder…"
                    disabled={isLoading || isSaving}
                  />
                </Field.Root>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Stack>
  )
}
