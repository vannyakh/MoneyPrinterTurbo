import {
  Box,
  Card,
  Field,
  Heading,
  Input,
  NativeSelect,
  Stack,
  Text,
} from '@chakra-ui/react'
import { PageShell } from '../components/ui/page-shell'
import { useSettingsStore } from '../store/settings-store'

const LLM_PROVIDERS = [
  'openai', 'aihubmix', 'moonshot', 'azure',
  'google', 'deepseek', 'ollama', 'qwen', 'minimax',
]

const cardStyle = {
  bg: 'bg.surface',
  borderColor: 'border.default',
  borderRadius: 'card',
  shadow: 'sm',
} as const

const inputStyle = {
  borderRadius: 'input',
  borderColor: 'border.default',
  bg: 'bg.subtle',
  fontWeight: '500',
} as const

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <Card.Root {...cardStyle}>
      <Card.Header>
        <Heading size="sm" fontWeight="700" color="text.primary">{title}</Heading>
        {description && (
          <Text fontSize="xs" fontWeight="500" color="text.secondary" mt={1}>
            {description}
          </Text>
        )}
      </Card.Header>
      <Card.Body>
        <Stack gap={5}>{children}</Stack>
      </Card.Body>
    </Card.Root>
  )
}

export default function SettingsPage() {
  const {
    apiBaseUrl, pexelsApiKey, pixabayApiKey, llmProvider, llmApiKey,
    setApiBaseUrl, setPexelsApiKey, setPixabayApiKey, setLlmProvider, setLlmApiKey,
  } = useSettingsStore()

  const fieldLabel = { fontWeight: '700', color: 'text.primary', fontSize: 'sm' }

  return (
    <PageShell>
      <Box>
        <Heading size="lg" fontWeight="800" color="text.primary">Settings</Heading>
        <Text fontSize="sm" fontWeight="500" color="text.secondary" mt={1}>
          Persisted locally in your browser.
        </Text>
      </Box>

      <SectionCard title="Connection" description="FastAPI backend address.">
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

      <SectionCard title="LLM Provider" description="Choose the large-language-model service for script generation.">
        <Field.Root>
          <Field.Label {...fieldLabel}>Provider</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              {...inputStyle}
              value={llmProvider}
              onChange={(e) => setLlmProvider(e.target.value)}
            >
              <option value="">Select a provider…</option>
              {LLM_PROVIDERS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>
        <Field.Root>
          <Field.Label {...fieldLabel}>API Key</Field.Label>
          <Input
            {...inputStyle}
            type="password"
            value={llmApiKey}
            onChange={(e) => setLlmApiKey(e.target.value)}
            placeholder="sk-…"
          />
        </Field.Root>
      </SectionCard>

      <SectionCard title="Video Sources" description="API keys for online stock-video providers.">
        <Field.Root>
          <Field.Label {...fieldLabel}>Pexels API Key</Field.Label>
          <Input
            {...inputStyle}
            type="password"
            value={pexelsApiKey}
            onChange={(e) => setPexelsApiKey(e.target.value)}
            placeholder="Enter Pexels API key"
          />
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
          <Input
            {...inputStyle}
            type="password"
            value={pixabayApiKey}
            onChange={(e) => setPixabayApiKey(e.target.value)}
            placeholder="Enter Pixabay API key"
          />
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
    </PageShell>
  )
}
