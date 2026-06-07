import {
  Badge,
  Button,
  Card,
  Field,
  Heading,
  HStack,
  Input,
  NativeSelect,
  Spinner,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { Sparkles, Video } from 'lucide-react'
import { API_BASE_URL, LOCALES, SCRIPT_LANGUAGES } from '../../constants/app'
import { useVideoActions } from '../../hooks/use-video-actions'
import { useVideoStore } from '../../store/video-store'

const toErrorText = (error: unknown) =>
  error instanceof Error ? error.message : ''

const cardStyle = {
  bg: 'bg.surface',
  borderColor: 'border.default',
  borderRadius: 'card',
  shadow: 'sm',
} as const

export function VideoScriptForm() {
  const {
    locale,
    videoSubject,
    videoScript,
    videoTerms,
    videoLanguage,
    paragraphNumber,
    taskId,
    setVideoSubject,
    setVideoScript,
    setVideoTerms,
    setVideoLanguage,
    setParagraphNumber,
  } = useVideoStore()

  const { generateScriptMutation, generateTermsMutation, createVideoMutation } = useVideoActions()

  const errorMessage =
    toErrorText(generateScriptMutation.error) ||
    toErrorText(generateTermsMutation.error) ||
    toErrorText(createVideoMutation.error)

  const inputStyle = {
    borderRadius: 'input',
    borderColor: 'border.default',
    bg: 'bg.subtle',
    fontWeight: '500',
    _focus: { borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' },
  } as const

  return (
    <Stack gap={5}>
      <Card.Root {...cardStyle}>
        <Card.Header pb={2}>
          <HStack justify="space-between">
            <Heading size="md" fontWeight="700" color="text.primary">
              Script Settings
            </Heading>
            <Badge
              colorPalette="blue"
              variant="subtle"
              borderRadius="badge"
              fontWeight="700"
              fontSize="xs"
              px={3}
            >
              {LOCALES[locale] ?? 'English'}
            </Badge>
          </HStack>
        </Card.Header>

        <Card.Body>
          <Stack gap={5}>
            {/* Subject */}
            <Field.Root>
              <Field.Label fontWeight="700" color="text.primary" fontSize="sm">
                Video subject
              </Field.Label>
              <Input
                {...inputStyle}
                value={videoSubject}
                onChange={(e) => setVideoSubject(e.target.value)}
                placeholder="Enter a topic or keyword…"
                size="md"
              />
            </Field.Root>

            {/* Language + paragraph count + generate script */}
            <HStack align="end" gap={3} flexWrap="wrap">
              <Field.Root maxW="220px">
                <Field.Label fontWeight="700" color="text.primary" fontSize="sm">
                  Script language
                </Field.Label>
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

              <Field.Root maxW="160px">
                <Field.Label fontWeight="700" color="text.primary" fontSize="sm">
                  Paragraphs
                </Field.Label>
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

              <Button
                colorPalette="blue"
                borderRadius="btn"
                fontWeight="700"
                onClick={() => generateScriptMutation.mutate()}
                disabled={!videoSubject || generateScriptMutation.isPending}
                gap={2}
              >
                {generateScriptMutation.isPending ? <Spinner size="xs" /> : <Sparkles size={15} />}
                Generate script
              </Button>
            </HStack>

            {/* Script textarea */}
            <Field.Root>
              <Field.Label fontWeight="700" color="text.primary" fontSize="sm">
                Video script
              </Field.Label>
              <Textarea
                {...inputStyle}
                value={videoScript}
                onChange={(e) => setVideoScript(e.target.value)}
                minH="200px"
                resize="vertical"
              />
            </Field.Root>

            {/* Keywords */}
            <HStack align="end" gap={3} flexWrap="wrap">
              <Field.Root flex={1} minW="260px">
                <Field.Label fontWeight="700" color="text.primary" fontSize="sm">
                  Video keywords
                </Field.Label>
                <Input
                  {...inputStyle}
                  value={videoTerms}
                  onChange={(e) => setVideoTerms(e.target.value)}
                  placeholder="nature, spring, flowers…"
                />
              </Field.Root>
              <Button
                colorPalette="teal"
                borderRadius="btn"
                fontWeight="700"
                onClick={() => generateTermsMutation.mutate()}
                disabled={!videoScript || generateTermsMutation.isPending}
                gap={2}
              >
                {generateTermsMutation.isPending ? <Spinner size="xs" /> : <Sparkles size={15} />}
                Generate keywords
              </Button>
            </HStack>
          </Stack>
        </Card.Body>

        <Card.Footer
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={3}
          pt={4}
          borderTop="1px solid"
          borderColor="border.default"
        >
          <Button
            colorPalette="purple"
            borderRadius="btn"
            fontWeight="700"
            size="md"
            onClick={() => createVideoMutation.mutate()}
            disabled={(!videoSubject && !videoScript) || createVideoMutation.isPending}
            gap={2}
          >
            {createVideoMutation.isPending ? <Spinner size="xs" /> : <Video size={16} />}
            Generate video
          </Button>

          {taskId ? (
            <Text fontWeight="600" fontSize="sm" color="text.success">
              Task created: {taskId.slice(0, 8)}…
            </Text>
          ) : (
            <Text fontSize="xs" fontWeight="500" color="text.muted">
              API: {API_BASE_URL}
            </Text>
          )}
        </Card.Footer>
      </Card.Root>

      {/* Error banner */}
      {errorMessage ? (
        <Card.Root bg="bg.error" borderColor="border.error" borderRadius="card">
          <Card.Body py={3}>
            <Text fontWeight="600" fontSize="sm" color="text.error">
              {errorMessage}
            </Text>
          </Card.Body>
        </Card.Root>
      ) : null}
    </Stack>
  )
}

