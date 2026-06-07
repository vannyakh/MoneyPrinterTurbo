import { Box, Button, Center, Heading, Text, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

export default function NotFoundPage() {
  return (
    <Center flex={1} minH="100vh" bg="bg.canvas">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.88 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      >
        <VStack gap={5} textAlign="center">
          {/* Floating emoji icon */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Box
              w="80px"
              h="80px"
              borderRadius="2xl"
              bg="bg.accent"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="3xl"
            >
              🔍
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20, delay: 0.12 }}
          >
            <Heading size="3xl" fontWeight="800" color="blue.500">
              404
            </Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut', delay: 0.2 }}
          >
            <Heading size="md" fontWeight="700" color="text.primary">
              Page not found
            </Heading>
            <Text fontSize="sm" fontWeight="500" color="text.secondary" maxW="320px" mt={2}>
              The page you are looking for does not exist or has been moved.
            </Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut', delay: 0.28 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button colorPalette="blue" borderRadius="btn" fontWeight="700">
              <Link to={ROUTES.create} style={{ color: 'inherit', textDecoration: 'none' }}>
                Back to Create
              </Link>
            </Button>
          </motion.div>
        </VStack>
      </motion.div>
    </Center>
  )
}
