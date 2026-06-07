import { useMemo } from 'react'
import { Card, Field, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { Bot, Languages } from 'lucide-react'
import { APP_SUBTITLE, APP_TITLE, LOCALES } from '../../constants/app'
import { useVideoStore } from '../../store/video-store'
import { MenuSelect } from './menu-select'

export function AppHeader() {
  const locale = useVideoStore((state) => state.locale)
  const setLocale = useVideoStore((state) => state.setLocale)

  const localeOptions = useMemo(
    () =>
      Object.entries(LOCALES).map(([code, name]) => ({
        value: code,
        label: `${code} - ${name}`,
      })),
    [],
  )

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
            <MenuSelect
              options={localeOptions}
              value={locale}
              onChange={setLocale}
              placeholder="Select language…"
            />
          </Field.Root>
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}
