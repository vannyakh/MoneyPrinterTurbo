import { Heading, Text } from '@chakra-ui/react'
import { PageShell } from '../components/ui/page-shell'
import { VideoScriptForm } from '../components/ui/video-script-form'

export default function CreatePage() {
  return (
    <PageShell>
      <Heading size="lg" fontWeight="800" color="text.primary">
        Create Video
      </Heading>
      <Text fontSize="sm" fontWeight="500" color="text.secondary" mt={-4}>
        Fill in the subject, generate a script, and produce a short video automatically.
      </Text>
      <VideoScriptForm />
    </PageShell>
  )
}
