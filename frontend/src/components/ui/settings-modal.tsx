import {
  Box,
  CloseButton,
  Dialog,
  Field,
  Flex,
  Input,
  Select,
  Separator,
  Stack,
  Switch,
  Text,
  createListCollection,
} from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Cpu, Film, Globe, Palette } from 'lucide-react'
import { useState } from 'react'
import { LOCALES } from '../../constants/app'
import { useColorMode } from './color-mode'
import { useSettingsStore } from '../../store/settings-store'
import { useVideoStore } from '../../store/video-store'
import { Tooltip } from './tooltip'

type SectionId = 'general' | 'appearance' | 'llm' | 'video'

const SECTIONS: { id: SectionId; label: string; description: string; icon: React.ElementType }[] = [
  { id: 'general',    label: 'General',       description: 'Backend connection settings.',                   icon: Globe   },
  { id: 'appearance', label: 'Appearance',    description: 'Customize the look and feel of the app.',       icon: Palette },
  { id: 'llm',        label: 'LLM Provider',  description: 'Language model service for script generation.', icon: Cpu     },
  { id: 'video',      label: 'Video Sources', description: 'API keys for online stock-video providers.',    icon: Film    },
]

const LLM_PROVIDERS = [
  'openai', 'aihubmix', 'moonshot', 'azure',
  'google', 'deepseek', 'ollama', 'qwen', 'minimax',
]

// Static collections defined once outside the component
const llmCollection = createListCollection({
  items: LLM_PROVIDERS.map((p) => ({ label: p, value: p })),
})

const localeCollection = createListCollection({
  items: Object.entries(LOCALES).map(([code, name]) => ({
    label: `${code} – ${name}`,
    value: code,
  })),
})

// Select used inside a Dialog must skip Portal and use fixed positioning
const dialogSelectProps = {
  positioning: { strategy: 'fixed' as const, hideWhenDetached: true },
  size: 'md' as const,
  width: 'full' as const,
}

const triggerStyle = {
  borderRadius: 'input',
  borderColor: 'border.default',
  bg: 'bg.subtle',
  fontWeight: '500' as const,
}

const inputStyle = {
  borderRadius: 'input',
  borderColor: 'border.default',
  bg: 'bg.subtle',
  fontWeight: '500',
  _focus: { borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' },
} as const

const fieldLabel = { fontWeight: '700', color: 'text.primary', fontSize: 'sm' } as const

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [active, setActive] = useState<SectionId>('general')

  const {
    apiBaseUrl, pexelsApiKey, pixabayApiKey, llmProvider, llmApiKey,
    setApiBaseUrl, setPexelsApiKey, setPixabayApiKey, setLlmProvider, setLlmApiKey,
  } = useSettingsStore()

  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  const locale    = useVideoStore((s) => s.locale)
  const setLocale = useVideoStore((s) => s.setLocale)

  const activeSection = SECTIONS.find((s) => s.id === active)!

  return (
    <Dialog.Root
      open={open}
      onOpenChange={({ open }) => !open && onClose()}
      size="cover"
      placement="center"
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          bg="bg.surface"
          borderColor="border.default"
          borderRadius="card"
          shadow="xl"
          overflow="hidden"
          maxH="80vh"
          display="flex"
          flexDirection="row"
          p={0}
          w="780px"
          maxW="95vw"
        >
          {/* ── Left nav panel ── */}
          <Box
            w="188px"
            flexShrink={0}
            bg="bg.sidebar"
            borderRight="1px solid"
            borderColor="border.default"
            display="flex"
            flexDirection="column"
            p={4}
            gap={2}
          >
            {/* Close button */}
            <Box mb={4}>
              <Dialog.CloseTrigger asChild>
                <CloseButton
                  size="sm"
                  borderRadius="nav"
                  color="text.secondary"
                  _hover={{ bg: 'bg.hover', color: 'text.primary' }}
                />
              </Dialog.CloseTrigger>
            </Box>

            {/* Section nav items */}
            <Stack gap="2px">
              {SECTIONS.map(({ id, label, icon: Icon }) => {
                const isActive = active === id
                return (
                  <button
                    key={id}
                    onClick={() => setActive(id)}
                    className={[
                      'relative flex items-center gap-2.5 w-full px-3 py-2 rounded-[11px] transition-all duration-120 select-none text-left',
                      isActive
                        ? 'bg-blue-500/[0.10] dark:bg-blue-500/[0.18]'
                        : 'hover:bg-black/[0.05] dark:hover:bg-white/[0.05]',
                    ].join(' ')}
                  >
                    <div className={[
                      'flex items-center justify-center w-7 h-7 rounded-[8px] flex-shrink-0 transition-colors duration-120',
                      isActive ? 'bg-blue-500/[0.15] dark:bg-blue-500/[0.22]' : 'bg-transparent',
                    ].join(' ')}>
                      <Icon
                        size={14}
                        className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}
                      />
                    </div>
                    <Text
                      fontSize="sm"
                      fontWeight={isActive ? '700' : '600'}
                      color={isActive ? 'text.nav.active' : 'text.nav.inactive'}
                    >
                      {label}
                    </Text>
                  </button>
                )
              })}
            </Stack>
          </Box>

          {/* ── Right content panel ── */}
          <Flex direction="column" flex={1} overflow="hidden">
            <Box overflowY="auto" flex={1} p={7}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                >
                  {/* Section heading */}
                  <Text fontWeight="800" fontSize="xl" color="text.primary" lineHeight={1.2} mb={1}>
                    {activeSection.label}
                  </Text>
                  <Text fontSize="xs" color="text.secondary" mb={7}>
                    {activeSection.description}
                  </Text>

                  <Stack gap={6}>

                    {/* ── General ── */}
                    {active === 'general' && (
                      <Field.Root>
                        <Field.Label {...fieldLabel}>API Base URL</Field.Label>
                        <Input
                          {...inputStyle}
                          value={apiBaseUrl}
                          onChange={(e) => setApiBaseUrl(e.target.value)}
                          placeholder="http://127.0.0.1:8080"
                        />
                        <Field.HelperText fontSize="xs" color="text.muted">
                          Change this if your backend runs on a different host or port.
                        </Field.HelperText>
                      </Field.Root>
                    )}

                    {/* ── Appearance ── */}
                    {active === 'appearance' && (
                      <>
                        <Field.Root>
                          <Switch.Root
                            checked={isDark}
                            onCheckedChange={toggleColorMode}
                            colorPalette="blue"
                            size="lg"
                          >
                            <Switch.HiddenInput />
                            <Switch.Control />
                            <Switch.Label>
                              <Text fontWeight="700" fontSize="sm" color="text.primary">
                                Dark mode
                              </Text>
                              <Text fontSize="xs" color="text.secondary">
                                {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
                              </Text>
                            </Switch.Label>
                          </Switch.Root>
                        </Field.Root>

                        <Separator borderColor="border.default" />

                        <Field.Root>
                          <Field.Label {...fieldLabel}>Language</Field.Label>
                          <Select.Root
                            {...dialogSelectProps}
                            collection={localeCollection}
                            value={[locale]}
                            onValueChange={(e) => setLocale(e.value[0] ?? locale)}
                          >
                            <Select.HiddenSelect />
                            <Select.Control>
                              <Select.Trigger {...triggerStyle}>
                                <Select.ValueText />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.Indicator />
                              </Select.IndicatorGroup>
                            </Select.Control>
                            <Select.Positioner>
                              <Select.Content>
                                {localeCollection.items.map((item) => (
                                  <Select.Item item={item} key={item.value}>
                                    {item.label}
                                    <Select.ItemIndicator />
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select.Positioner>
                          </Select.Root>
                          <Field.HelperText fontSize="xs" color="text.muted">
                            Language used for video script generation.
                          </Field.HelperText>
                        </Field.Root>
                      </>
                    )}

                    {/* ── LLM Provider ── */}
                    {active === 'llm' && (
                      <>
                        <Field.Root>
                          <Field.Label {...fieldLabel}>Provider</Field.Label>
                          <Select.Root
                            {...dialogSelectProps}
                            collection={llmCollection}
                            value={llmProvider ? [llmProvider] : []}
                            onValueChange={(e) => setLlmProvider(e.value[0] ?? '')}
                          >
                            <Select.HiddenSelect />
                            <Select.Control>
                              <Select.Trigger {...triggerStyle}>
                                <Select.ValueText placeholder="Select a provider…" />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.Indicator />
                              </Select.IndicatorGroup>
                            </Select.Control>
                            <Select.Positioner>
                              <Select.Content>
                                {llmCollection.items.map((item) => (
                                  <Select.Item item={item} key={item.value}>
                                    {item.label}
                                    <Select.ItemIndicator />
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select.Positioner>
                          </Select.Root>
                        </Field.Root>

                        <Field.Root>
                          <Field.Label {...fieldLabel}>API Key</Field.Label>
                          <Tooltip content="Stored only in your browser — never sent to any server other than your configured provider.">
                            <Input
                              {...inputStyle}
                              type="password"
                              value={llmApiKey}
                              onChange={(e) => setLlmApiKey(e.target.value)}
                              placeholder="sk-…"
                            />
                          </Tooltip>
                          <Field.HelperText fontSize="xs" color="text.muted">
                            Stored locally in your browser only.
                          </Field.HelperText>
                        </Field.Root>
                      </>
                    )}

                    {/* ── Video Sources ── */}
                    {active === 'video' && (
                      <>
                        <Field.Root>
                          <Field.Label {...fieldLabel}>Pexels API Key</Field.Label>
                          <Tooltip content="Stored locally — used only to search Pexels for stock footage.">
                            <Input
                              {...inputStyle}
                              type="password"
                              value={pexelsApiKey}
                              onChange={(e) => setPexelsApiKey(e.target.value)}
                              placeholder="Enter Pexels API key"
                            />
                          </Tooltip>
                          <Field.HelperText fontSize="xs">
                            <a
                              href="https://www.pexels.com/api/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline font-semibold hover:opacity-80"
                            >
                              Get a free key at pexels.com
                            </a>
                          </Field.HelperText>
                        </Field.Root>

                        <Separator borderColor="border.default" />

                        <Field.Root>
                          <Field.Label {...fieldLabel}>Pixabay API Key</Field.Label>
                          <Tooltip content="Stored locally — used only to search Pixabay for stock footage.">
                            <Input
                              {...inputStyle}
                              type="password"
                              value={pixabayApiKey}
                              onChange={(e) => setPixabayApiKey(e.target.value)}
                              placeholder="Enter Pixabay API key"
                            />
                          </Tooltip>
                          <Field.HelperText fontSize="xs">
                            <a
                              href="https://pixabay.com/api/docs/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline font-semibold hover:opacity-80"
                            >
                              Get a free key at pixabay.com
                            </a>
                          </Field.HelperText>
                        </Field.Root>
                      </>
                    )}

                  </Stack>
                </motion.div>
              </AnimatePresence>
            </Box>
          </Flex>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
