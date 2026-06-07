import { Box, Flex } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { VideoScriptForm } from '../components/ui/video-script-form'
import { OutputPreviewPanel } from '../components/ui/output-preview-panel'

export default function CreatePage() {
  return (
    <Flex h="full" overflow="hidden" bg="bg.canvas">
      {/* ── Left panel — form (fixed width, full height) ─────── */}
      <Flex
        w={{ base: 'full', lg: '460px', xl: '500px' }}
        minW="380px"
        flexShrink={0}
        h="full"
        direction="column"
        overflow="hidden"
        borderRight="1px solid"
        borderColor="border.default"
        bg="bg.canvas"
      >
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
        >
          <VideoScriptForm />
        </motion.div>
      </Flex>

      {/* ── Right panel — output preview (flex, scrollable) ─── */}
      <Box
        flex={1}
        overflowY="auto"
        bg="bg.subtle"
        minW={0}
      >
        <Box px={6} pt={6} pb={8}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.26, ease: 'easeOut', delay: 0.08 }}
          >
            <OutputPreviewPanel />
          </motion.div>
        </Box>
      </Box>
    </Flex>
  )
}
