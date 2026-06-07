import { useState } from 'react'
import {
  Box,
  Button,
  Field,
  Flex,
  HStack,
  Input,
  NativeSelect,
  Spinner,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  FileText,
  Film,
  Mic,
  Sparkles,
  Type,
  Video,
} from 'lucide-react'
import { Tooltip } from './tooltip'
import { slideDown } from '../../lib/motion'
import { API_BASE_URL, LOCALES, SCRIPT_LANGUAGES } from '../../constants/app'
import { useVideoActions } from '../../hooks/use-video-actions'
import { useVideoStore } from '../../store/video-store'

// ── Shared style tokens ───────────────────────────────────────────────────────
const inputStyle = {
  borderRadius: 'input',
  borderColor:  'border.default',
  bg:           'bg.subtle',
  fontWeight:   '500',
  _focus: { borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' },
} as const

const labelStyle = { fontWeight: '700', color: 'text.primary', fontSize: 'sm' } as const

const MotionButton = motion.create(Button)

// ── Helpers ───────────────────────────────────────────────────────────────────
const toErrorText = (e: unknown) => (e instanceof Error ? e.message : '')

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <HStack
      as="button"
      gap={2.5}
      onClick={() => onChange(!checked)}
      cursor="pointer"
      align="center"
      type="button"
    >
      <Box
        w="34px"
        h="20px"
        borderRadius="full"
        bg={checked ? 'blue.500' : 'bg.subtle'}
        border="1px solid"
        borderColor={checked ? 'blue.500' : 'border.strong'}
        position="relative"
        transition="background 0.2s, border-color 0.2s"
        flexShrink={0}
      >
        <Box
          position="absolute"
          top="3px"
          left={checked ? '17px' : '3px'}
          w="12px"
          h="12px"
          borderRadius="full"
          bg="white"
          transition="left 0.2s"
          boxShadow="0 1px 3px rgba(0,0,0,0.25)"
        />
      </Box>
      <Text fontSize="sm" fontWeight="600" color="text.primary" userSelect="none">
        {label}
      </Text>
    </HStack>
  )
}

// ── Inline color picker ───────────────────────────────────────────────────────
function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Field.Root>
      <Field.Label {...labelStyle}>{label}</Field.Label>
      <HStack gap={2} align="center">
        <Box
          as="input"
          type="color"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          w="40px"
          h="36px"
          borderRadius="input"
          border="1px solid"
          borderColor="border.default"
          bg="bg.subtle"
          cursor="pointer"
          p="2px"
          flexShrink={0}
        />
        <Input
          {...inputStyle}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          fontFamily="mono"
          fontSize="xs"
          maxW="120px"
        />
      </HStack>
    </Field.Root>
  )
}

// ── Range slider ──────────────────────────────────────────────────────────────
function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
}) {
  return (
    <Field.Root>
      <HStack justify="space-between" mb={1}>
        <Field.Label {...labelStyle} mb={0}>{label}</Field.Label>
        <Text fontSize="xs" fontWeight="700" color="text.secondary" fontFamily="mono">
          {value}
        </Text>
      </HStack>
      <Box
        as="input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
        w="full"
        cursor="pointer"
        accentColor="var(--chakra-colors-blue-500)"
      />
    </Field.Root>
  )
}

// ── Option toggle group (radio-style buttons) ─────────────────────────────────
function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <Field.Root>
      <Field.Label {...labelStyle}>{label}</Field.Label>
      <HStack gap={1.5} flexWrap="wrap">
        {options.map((o) => {
          const active = value === o.value
          return (
            <Box
              key={o.value}
              as="button"
              type="button"
              onClick={() => onChange(o.value)}
              px={3}
              py="6px"
              borderRadius="8px"
              fontSize="xs"
              fontWeight="700"
              border="1px solid"
              borderColor={active ? 'blue.500' : 'border.default'}
              bg={active ? 'bg.active' : 'bg.subtle'}
              color={active ? 'blue.500' : 'text.muted'}
              cursor="pointer"
              transition="all 0.15s"
              _hover={!active ? { borderColor: 'border.strong', color: 'text.secondary' } : {}}
            >
              {o.label}
            </Box>
          )
        })}
      </HStack>
    </Field.Root>
  )
}

// ── Collapsible form section ──────────────────────────────────────────────────
function FormSection({
  title,
  icon: Icon,
  defaultOpen = false,
  children,
}: {
  title: string
  icon: React.ElementType
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Box borderBottom="1px solid" borderColor="border.default">
      <HStack
        as="button"
        type="button"
        w="full"
        justify="space-between"
        align="center"
        py={3.5}
        onClick={() => setOpen((v) => !v)}
        cursor="pointer"
        _hover={{ opacity: 0.8 }}
        transition="opacity 0.15s"
      >
        <HStack gap={2.5}>
          <Box
            w="26px"
            h="26px"
            borderRadius="8px"
            bg="bg.subtle"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <Icon size={13} className="text-slate-400 dark:text-slate-500" />
          </Box>
          <Text fontWeight="700" fontSize="sm" color="text.primary">
            {title}
          </Text>
        </HStack>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex' }}
        >
          <ChevronDown size={14} className="text-slate-400" />
        </motion.div>
      </HStack>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <Box pb={5}>
              <Stack gap={4}>{children}</Stack>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

// ── Constants ─────────────────────────────────────────────────────────────────
const VIDEO_SOURCES = [
  { value: 'pexels',      label: 'Pexels'       },
  { value: 'pixabay',     label: 'Pixabay'      },
  { value: 'local',       label: 'Local file'   },
  { value: 'douyin',      label: 'TikTok'       },
  { value: 'bilibili',    label: 'Bilibili'     },
  { value: 'xiaohongshu', label: 'Xiaohongshu'  },
] as const

const VIDEO_ASPECTS = [
  { value: '9:16', label: '9:16' },
  { value: '16:9', label: '16:9' },
  { value: '1:1',  label: '1:1'  },
] as const

const CONCAT_MODES = [
  { value: 'random',     label: 'Random'     },
  { value: 'sequential', label: 'Sequential' },
] as const

const TRANSITION_MODES = [
  { value: '',         label: 'None'     },
  { value: 'Shuffle',  label: 'Shuffle'  },
  { value: 'FadeIn',   label: 'Fade In'  },
  { value: 'FadeOut',  label: 'Fade Out' },
  { value: 'SlideIn',  label: 'Slide In' },
  { value: 'SlideOut', label: 'Slide Out'},
] as const

const CLIP_DURATIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10] as const
const VIDEO_COUNTS   = [1, 2, 3, 4, 5] as const

const VOICE_VOLUMES = [0.6, 0.8, 1.0, 1.2, 1.5, 2.0, 3.0, 4.0, 5.0] as const
const VOICE_RATES   = [0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.5, 1.8, 2.0] as const
const BGM_VOLUMES   = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] as const

const BGM_TYPES = [
  { value: 'random', label: 'Random' },
  { value: '',       label: 'None'   },
  { value: 'custom', label: 'Custom' },
] as const

const SUBTITLE_POSITIONS = [
  { value: 'bottom', label: 'Bottom' },
  { value: 'center', label: 'Center' },
  { value: 'top',    label: 'Top'    },
  { value: 'custom', label: 'Custom' },
] as const

// ── Main form ─────────────────────────────────────────────────────────────────
export function VideoScriptForm() {
  const store = useVideoStore()
  const {
    locale, videoSubject, videoScript, videoTerms,
    videoLanguage, paragraphNumber, videoScriptPrompt, customSystemPrompt,
    videoSource, videoAspect, videoConcatMode, videoTransitionMode,
    videoClipDuration, videoCount,
    voiceName, voiceVolume, voiceRate,
    bgmType, bgmFile, bgmVolume,
    subtitleEnabled, subtitlePosition, customPosition,
    fontName, textForeColor, fontSize, strokeColor, strokeWidth,
    subtitleBgEnabled, textBgColor, roundedSubtitleBg,
    update, setVideoSubject, setVideoScript, setVideoTerms,
    setVideoLanguage, setParagraphNumber,
  } = store

  const [useCustomSysPrompt, setUseCustomSysPrompt] = useState(false)
  const [showAdvancedScript, setShowAdvancedScript] = useState(false)

  const { generateScriptMutation, generateTermsMutation, createVideoMutation } = useVideoActions()

  const errorMessage =
    toErrorText(generateScriptMutation.error) ||
    toErrorText(generateTermsMutation.error) ||
    toErrorText(createVideoMutation.error)

  return (
    <Flex direction="column" flex={1} minH={0} h="full">
      {/* ── Scrollable sections ───────────────────────────────── */}
      <Box flex={1} overflowY="auto" px={6} pt={6} pb={4}>
        <Stack gap={0}>

          {/* ════ SCRIPT ════════════════════════════════════════ */}
          <FormSection title="Script" icon={FileText} defaultOpen>
            <Field.Root>
              <Field.Label {...labelStyle}>Video subject</Field.Label>
              <Input
                {...inputStyle}
                value={videoSubject}
                onChange={(e) => setVideoSubject(e.target.value)}
                placeholder="Enter a topic or keyword…"
              />
            </Field.Root>

            {/* Language + Paragraphs + Generate Script */}
            <HStack align="end" gap={3} flexWrap="wrap">
              <Field.Root maxW="200px">
                <Field.Label {...labelStyle}>Language</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    {...inputStyle}
                    value={videoLanguage}
                    onChange={(e) => setVideoLanguage(e.target.value)}
                  >
                    {SCRIPT_LANGUAGES.map((code) => (
                      <option key={code || 'auto'} value={code}>
                        {code || 'Auto Detect'}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>

              <Field.Root maxW="110px">
                <Field.Label {...labelStyle}>Paragraphs</Field.Label>
                <Input
                  {...inputStyle}
                  type="number"
                  min={1}
                  max={10}
                  value={paragraphNumber}
                  onChange={(e) =>
                    setParagraphNumber(
                      Math.min(10, Math.max(1, Number.parseInt(e.target.value || '1', 10))),
                    )
                  }
                />
              </Field.Root>

              <Tooltip content="Generate script using AI">
                <MotionButton
                  colorPalette="blue"
                  borderRadius="btn"
                  fontWeight="700"
                  onClick={() => generateScriptMutation.mutate()}
                  disabled={!videoSubject || generateScriptMutation.isPending}
                  gap={2}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  {generateScriptMutation.isPending ? <Spinner size="xs" /> : <Sparkles size={14} />}
                  Generate script
                </MotionButton>
              </Tooltip>
            </HStack>

            {/* Advanced script options */}
            <Box>
              <Box
                as="button"
                type="button"
                onClick={() => setShowAdvancedScript((v) => !v)}
                display="flex"
                alignItems="center"
                gap={1.5}
                cursor="pointer"
                mb={showAdvancedScript ? 3 : 0}
              >
                <motion.div
                  animate={{ rotate: showAdvancedScript ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex' }}
                >
                  <ChevronDown size={12} className="text-slate-400" />
                </motion.div>
                <Text fontSize="xs" fontWeight="600" color="text.muted">
                  Advanced script options
                </Text>
              </Box>

              <AnimatePresence initial={false}>
                {showAdvancedScript && (
                  <motion.div
                    key="adv"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <Stack gap={4}>
                      <Field.Root>
                        <Field.Label {...labelStyle}>Custom script requirements</Field.Label>
                        <Textarea
                          {...inputStyle}
                          value={videoScriptPrompt}
                          onChange={(e) => update({ videoScriptPrompt: e.target.value })}
                          placeholder="Describe special requirements for the script…"
                          minH="80px"
                          resize="vertical"
                          maxLength={2000}
                        />
                      </Field.Root>

                      <Toggle
                        checked={useCustomSysPrompt}
                        onChange={(v) => {
                          setUseCustomSysPrompt(v)
                          if (!v) update({ customSystemPrompt: '' })
                        }}
                        label="Use custom system prompt"
                      />

                      {useCustomSysPrompt && (
                        <Field.Root>
                          <Field.Label {...labelStyle}>Custom system prompt</Field.Label>
                          <Textarea
                            {...inputStyle}
                            value={customSystemPrompt}
                            onChange={(e) => update({ customSystemPrompt: e.target.value })}
                            minH="120px"
                            resize="vertical"
                            maxLength={8000}
                          />
                        </Field.Root>
                      )}
                    </Stack>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>

            {/* Script textarea */}
            <Field.Root>
              <Field.Label {...labelStyle}>Video script</Field.Label>
              <Textarea
                {...inputStyle}
                value={videoScript}
                onChange={(e) => setVideoScript(e.target.value)}
                minH="180px"
                resize="vertical"
              />
            </Field.Root>

            {/* Keywords + Generate Keywords */}
            <HStack align="end" gap={3} flexWrap="wrap">
              <Field.Root flex={1} minW="180px">
                <Field.Label {...labelStyle}>Video keywords</Field.Label>
                <Input
                  {...inputStyle}
                  value={videoTerms}
                  onChange={(e) => setVideoTerms(e.target.value)}
                  placeholder="nature, spring, flowers…"
                />
              </Field.Root>
              <Tooltip content="Extract keywords from the script">
                <MotionButton
                  colorPalette="teal"
                  borderRadius="btn"
                  fontWeight="700"
                  onClick={() => generateTermsMutation.mutate()}
                  disabled={!videoScript || generateTermsMutation.isPending}
                  gap={2}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  {generateTermsMutation.isPending ? <Spinner size="xs" /> : <Sparkles size={14} />}
                  Generate keywords
                </MotionButton>
              </Tooltip>
            </HStack>

            {/* Error banner */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  key="err"
                  variants={slideDown}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ originY: 0 }}
                >
                  <Box
                    bg="bg.error"
                    border="1px solid"
                    borderColor="border.error"
                    borderRadius="card"
                    px={4}
                    py={3}
                  >
                    <Text fontWeight="600" fontSize="sm" color="text.error">
                      {errorMessage}
                    </Text>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </FormSection>

          {/* ════ VIDEO SETTINGS ════════════════════════════════ */}
          <FormSection title="Video Settings" icon={Film}>
            <Field.Root>
              <Field.Label {...labelStyle}>Video source</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  {...inputStyle}
                  value={videoSource}
                  onChange={(e) => update({ videoSource: e.target.value })}
                >
                  {VIDEO_SOURCES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>

            <OptionGroup
              label="Aspect ratio"
              options={VIDEO_ASPECTS}
              value={videoAspect as typeof VIDEO_ASPECTS[number]['value']}
              onChange={(v) => update({ videoAspect: v })}
            />

            <OptionGroup
              label="Clip order"
              options={CONCAT_MODES}
              value={videoConcatMode as typeof CONCAT_MODES[number]['value']}
              onChange={(v) => update({ videoConcatMode: v })}
            />

            <Field.Root>
              <Field.Label {...labelStyle}>Transition</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  {...inputStyle}
                  value={videoTransitionMode}
                  onChange={(e) => update({ videoTransitionMode: e.target.value })}
                >
                  {TRANSITION_MODES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>

            <HStack gap={3}>
              <Field.Root flex={1}>
                <Field.Label {...labelStyle}>Clip duration</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    {...inputStyle}
                    value={videoClipDuration}
                    onChange={(e) => update({ videoClipDuration: Number(e.target.value) })}
                  >
                    {CLIP_DURATIONS.map((d) => (
                      <option key={d} value={d}>{d}s</option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>

              <Field.Root flex={1}>
                <Field.Label {...labelStyle}>Videos to generate</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    {...inputStyle}
                    value={videoCount}
                    onChange={(e) => update({ videoCount: Number(e.target.value) })}
                  >
                    {VIDEO_COUNTS.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>
            </HStack>
          </FormSection>

          {/* ════ AUDIO ══════════════════════════════════════════ */}
          <FormSection title="Audio" icon={Mic}>
            <Field.Root>
              <Field.Label {...labelStyle}>Voice name</Field.Label>
              <Input
                {...inputStyle}
                value={voiceName}
                onChange={(e) => update({ voiceName: e.target.value })}
                placeholder="e.g. en-US-JennyNeural-Female"
                fontFamily="mono"
                fontSize="xs"
              />
              <Field.HelperText fontSize="xs" color="text.muted">
                Leave blank for server default. Format: locale-Name-Gender
              </Field.HelperText>
            </Field.Root>

            <HStack gap={3}>
              <Field.Root flex={1}>
                <Field.Label {...labelStyle}>Voice volume</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    {...inputStyle}
                    value={voiceVolume}
                    onChange={(e) => update({ voiceVolume: Number(e.target.value) })}
                  >
                    {VOICE_VOLUMES.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>

              <Field.Root flex={1}>
                <Field.Label {...labelStyle}>Voice rate</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    {...inputStyle}
                    value={voiceRate}
                    onChange={(e) => update({ voiceRate: Number(e.target.value) })}
                  >
                    {VOICE_RATES.map((r) => (
                      <option key={r} value={r}>{r}×</option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>
            </HStack>

            <OptionGroup
              label="Background music"
              options={BGM_TYPES}
              value={bgmType as typeof BGM_TYPES[number]['value']}
              onChange={(v) => update({ bgmType: v })}
            />

            {bgmType === 'custom' && (
              <Field.Root>
                <Field.Label {...labelStyle}>BGM filename</Field.Label>
                <Input
                  {...inputStyle}
                  value={bgmFile}
                  onChange={(e) => update({ bgmFile: e.target.value })}
                  placeholder="output013.mp3"
                  fontFamily="mono"
                  fontSize="xs"
                />
              </Field.Root>
            )}

            <Field.Root>
              <Field.Label {...labelStyle}>BGM volume</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  {...inputStyle}
                  value={bgmVolume}
                  onChange={(e) => update({ bgmVolume: Number(e.target.value) })}
                >
                  {BGM_VOLUMES.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>
          </FormSection>

          {/* ════ SUBTITLE ═══════════════════════════════════════ */}
          <FormSection title="Subtitles" icon={Type}>
            <Toggle
              checked={subtitleEnabled}
              onChange={(v) => update({ subtitleEnabled: v })}
              label="Enable subtitles"
            />

            {subtitleEnabled && (
              <Stack gap={4}>
                <OptionGroup
                  label="Position"
                  options={SUBTITLE_POSITIONS}
                  value={subtitlePosition as typeof SUBTITLE_POSITIONS[number]['value']}
                  onChange={(v) => update({ subtitlePosition: v })}
                />

                {subtitlePosition === 'custom' && (
                  <Field.Root>
                    <Field.Label {...labelStyle}>Custom position (% from top)</Field.Label>
                    <Input
                      {...inputStyle}
                      type="number"
                      min={0}
                      max={100}
                      value={customPosition}
                      onChange={(e) => update({ customPosition: Number(e.target.value) })}
                    />
                  </Field.Root>
                )}

                <Field.Root>
                  <Field.Label {...labelStyle}>Font name</Field.Label>
                  <Input
                    {...inputStyle}
                    value={fontName}
                    onChange={(e) => update({ fontName: e.target.value })}
                    placeholder="STHeitiMedium.ttc"
                    fontFamily="mono"
                    fontSize="xs"
                  />
                </Field.Root>

                <RangeField
                  label="Font size"
                  value={fontSize}
                  min={30}
                  max={100}
                  onChange={(v) => update({ fontSize: v })}
                />

                <HStack gap={4} align="start">
                  <ColorPicker
                    label="Text color"
                    value={textForeColor}
                    onChange={(v) => update({ textForeColor: v })}
                  />
                  <ColorPicker
                    label="Stroke color"
                    value={strokeColor}
                    onChange={(v) => update({ strokeColor: v })}
                  />
                </HStack>

                <RangeField
                  label="Stroke width"
                  value={strokeWidth}
                  min={0}
                  max={10}
                  step={0.5}
                  onChange={(v) => update({ strokeWidth: v })}
                />

                <Toggle
                  checked={subtitleBgEnabled}
                  onChange={(v) => update({ subtitleBgEnabled: v })}
                  label="Subtitle background"
                />

                {subtitleBgEnabled && (
                  <Stack gap={3}>
                    <ColorPicker
                      label="Background color"
                      value={textBgColor}
                      onChange={(v) => update({ textBgColor: v })}
                    />
                    <Toggle
                      checked={roundedSubtitleBg}
                      onChange={(v) => update({ roundedSubtitleBg: v })}
                      label="Rounded background"
                    />
                  </Stack>
                )}
              </Stack>
            )}
          </FormSection>

        </Stack>
      </Box>

      {/* ── Pinned footer ─────────────────────────────────────── */}
      <Box
        px={6}
        py={4}
        flexShrink={0}
        borderTop="1px solid"
        borderColor="border.default"
        bg="bg.canvas"
      >
        <HStack justify="space-between" align="center">
          <MotionButton
            colorPalette="purple"
            borderRadius="btn"
            fontWeight="700"
            size="md"
            onClick={() => createVideoMutation.mutate()}
            disabled={(!videoSubject && !videoScript) || createVideoMutation.isPending}
            gap={2}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            {createVideoMutation.isPending ? <Spinner size="xs" /> : <Video size={16} />}
            Generate video
          </MotionButton>

          <Text fontSize="xs" fontWeight="500" color="text.muted">
            {LOCALES[locale] ?? 'English'} · {API_BASE_URL}
          </Text>
        </HStack>
      </Box>
    </Flex>
  )
}
