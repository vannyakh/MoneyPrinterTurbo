import { Heading, Text } from '@chakra-ui/react'
import { SettingsForm } from '../components/ui/settings-form'
import { PageShell } from '../components/ui/page-shell'

export default function SettingsPage() {
  return (
    <PageShell>
      <Heading size="lg" fontWeight="800" color="text.primary">
        Settings
      </Heading>
      <Text fontSize="sm" fontWeight="500" color="text.secondary" mt={1}>
        Persisted locally in your browser.
      </Text>

      <SettingsForm />
    </PageShell>
  )
}
