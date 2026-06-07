import { Center, Spinner, Text, VStack } from '@chakra-ui/react'

export function LoadingScreen() {
  return (
    <Center flex={1} minH="300px" bg="bg.canvas">
      <VStack gap={3}>
        <Spinner size="lg" color="blue.500" />
        <Text fontWeight="600" fontSize="sm" color="text.secondary">
          Loading…
        </Text>
      </VStack>
    </Center>
  )
}
