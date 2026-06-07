import { Box, Center, Text, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'

export function LoadingScreen() {
  return (
    <Center flex={1} minH="300px" bg="bg.canvas">
      <VStack gap={5}>
        {/* Pulsing ring loader */}
        <Box position="relative" w="52px" h="52px" display="flex" alignItems="center" justifyContent="center">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: 'var(--chakra-colors-blue-500, #3b82f6)',
              }}
              animate={{ scale: [1, 1.9], opacity: [0.75, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeOut',
                delay: i * 0.55,
              }}
            />
          ))}
          <Box w="16px" h="16px" borderRadius="full" bg="blue.500" />
        </Box>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Text fontWeight="600" fontSize="sm" color="text.secondary">
            Loading…
          </Text>
        </motion.div>
      </VStack>
    </Center>
  )
}
