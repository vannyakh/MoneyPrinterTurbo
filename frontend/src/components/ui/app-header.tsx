import { Card, Field, Heading, HStack, NativeSelect, Stack, Text } from '@chakra-ui/react'
import { Bot, Languages } from 'lucide-react'
import { APP_SUBTITLE, APP_TITLE, LOCALES } from '../../constants/app'
import { useVideoStore } from '../../store/video-store'

export function AppHeader() {
  const locale = useVideoStore((state) => state.locale)
  const setLocale = useVideoStore((state) => state.setLocale)

  return (
    <Card.Root bg="rgba(15,23,42,0.7)" borderColor="rgba(148,163,184,0.25)">
      <Card.Body>
        <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" gap={4}>
          <Stack gap={1}>
            <HStack gap={2}>
              <Bot size={20} />
              <Heading size="lg">{APP_TITLE}</Heading>
            </HStack>
            <Text color="gray.300">{APP_SUBTITLE}</Text>
          </Stack>
          <Field.Root maxW={{ md: '240px' }}>
            <Field.Label>
              <HStack gap={2}>
                <Languages size={16} />
                <Text>Interface language</Text>
              </HStack>
            </Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field value={locale} onChange={(event) => setLocale(event.target.value)}>
                {Object.entries(LOCALES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {code} - {name}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}
