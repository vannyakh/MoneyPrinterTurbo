import { Box, Container, Stack } from '@chakra-ui/react'
import type { PropsWithChildren } from 'react'

type PageShellProps = PropsWithChildren<{
  maxW?: string
}>

export function PageShell({ children, maxW = '5xl' }: PageShellProps) {
  return (
    <Box flex={1} overflowY="auto" py={8} px={6} bg="bg.canvas">
      <Container maxW={maxW}>
        <Stack gap={6}>{children}</Stack>
      </Container>
    </Box>
  )
}
