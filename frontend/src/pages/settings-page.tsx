import { Heading, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { SettingsForm } from '../components/ui/settings-form'
import { PageShell } from '../components/ui/page-shell'

export default function SettingsPage() {
  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' as const }}
      >
        <Heading size="lg" fontWeight="800" color="text.primary">
          Settings
        </Heading>
        <Text fontSize="sm" fontWeight="500" color="text.secondary" mt={1}>
          Persisted locally in your browser.
        </Text>
      </motion.div>

      <SettingsForm animate />
    </PageShell>
  )
}
