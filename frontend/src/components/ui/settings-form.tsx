import {
  Card,
  Field,
  Fieldset,
  Input,
  Portal,
  Select,
  Stack,
  createListCollection,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Tooltip } from './tooltip'
import { useSettingsStore } from '../../store/settings-store'
import { fieldTriggerStyle, inputStyle } from '../../lib/field-styles'

const LLM_PROVIDERS = [
  'openai', 'aihubmix', 'moonshot', 'azure',
  'google', 'deepseek', 'ollama', 'qwen', 'minimax',
]

const llmCollection = createListCollection({
  items: LLM_PROVIDERS.map((p) => ({ label: p, value: p })),
})

const cardStyle = {
  bg: 'bg.surface',
  borderColor: 'border.default',
  borderRadius: 'card',
  shadow: 'sm',
} as const

const fieldLabel = { fontWeight: '700', color: 'text.primary', fontSize: 'sm' } as const

function SectionCard({
  title,
  description,
  children,
  delay = 0,
  animate = true,
}: {
  title: string
  description?: string
  children: React.ReactNode
  delay?: number
  animate?: boolean
}) {
  const inner = (
    <Card.Root {...cardStyle}>
      <Card.Body>
        <Fieldset.Root>
          <Stack gap={0.5} mb={5}>
            <Fieldset.Legend
              fontWeight="700"
              color="text.primary"
              fontSize="sm"
              p={0}
              border={0}
              mb={0}
            >
              {title}
            </Fieldset.Legend>
            {description && (
              <Fieldset.HelperText fontSize="xs" color="text.secondary" mt={0}>
                {description}
              </Fieldset.HelperText>
            )}
          </Stack>
          <Fieldset.Content>
            <Stack gap={5}>{children}</Stack>
          </Fieldset.Content>
        </Fieldset.Root>
      </Card.Body>
    </Card.Root>
  )

  if (!animate) return inner

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' as const, delay }}
    >
      {inner}
    </motion.div>
  )
}

interface SettingsFormProps {
  animate?: boolean
}

export function SettingsForm({ animate = false }: SettingsFormProps) {
  const {
    apiBaseUrl, pexelsApiKey, pixabayApiKey, llmProvider, llmApiKey,
    setApiBaseUrl, setPexelsApiKey, setPixabayApiKey, setLlmProvider, setLlmApiKey,
  } = useSettingsStore()

  return (
    <Stack gap={5}>
      {/* Connection */}
      <SectionCard
        title="Connection"
        description="FastAPI backend address."
        delay={0.06}
        animate={animate}
      >
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
      </SectionCard>

      {/* LLM Provider */}
      <SectionCard
        title="LLM Provider"
        description="Choose the large-language-model service for script generation."
        delay={0.12}
        animate={animate}
      >
        <Field.Root>
          <Field.Label {...fieldLabel}>Provider</Field.Label>
          <Select.Root
            collection={llmCollection}
            value={llmProvider ? [llmProvider] : []}
            onValueChange={(e) => setLlmProvider(e.value[0] ?? '')}
            size="md"
            width="full"
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger {...fieldTriggerStyle}>
                <Select.ValueText placeholder="Select a provider…" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
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
            </Portal>
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
        </Field.Root>
      </SectionCard>

      {/* Video Sources */}
      <SectionCard
        title="Video Sources"
        description="API keys for online stock-video providers."
        delay={0.18}
        animate={animate}
      >
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
      </SectionCard>
    </Stack>
  )
}
