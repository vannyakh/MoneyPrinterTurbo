import { Box, Button, Center, Heading, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

export default function NotFoundPage() {
  return (
    <Center flex={1} minH="100vh" bg="bg.canvas">
      <VStack gap={5} textAlign="center">
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
        <Heading size="3xl" fontWeight="800" color="blue.500">
          404
        </Heading>
        <Heading size="md" fontWeight="700" color="text.primary">
          Page not found
        </Heading>
        <Text fontSize="sm" fontWeight="500" color="text.secondary" maxW="320px">
          The page you are looking for does not exist or has been moved.
        </Text>
        <Button colorPalette="blue" borderRadius="btn" fontWeight="700">
          <Link to={ROUTES.create} style={{ color: 'inherit', textDecoration: 'none' }}>
            Back to Create
          </Link>
        </Button>
      </VStack>
    </Center>
  )
}
