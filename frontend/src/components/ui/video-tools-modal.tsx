import {
  Badge,
  Box,
  Button,
  CloseButton,
  Dialog,
  HStack,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Copy, Download, ExternalLink, Film } from 'lucide-react'
import { useState } from 'react'

type VideoToolsModalProps = {
  open: boolean
  onClose: () => void
  videos: string[]
  activeIndex: number
  onSelectVideo: (index: number) => void
  taskId?: string
}

function fileName(url: string) {
  return url.split('/').pop() ?? url
}

export function VideoToolsModal({
  open,
  onClose,
  videos,
  activeIndex,
  onSelectVideo,
  taskId,
}: VideoToolsModalProps) {
  const [copied, setCopied] = useState(false)
  const activeUrl = videos[activeIndex] ?? ''

  const copyUrl = async () => {
    if (!activeUrl) return
    try {
      await navigator.clipboard.writeText(activeUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} placement="center">
      <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <Dialog.Positioner>
        <Dialog.Content
          bg="bg.surface"
          borderColor="border.default"
          borderRadius="card"
          shadow="xl"
          maxW="420px"
          mx={4}
        >
          <Dialog.Header borderBottom="1px solid" borderColor="border.default" py={4} px={5}>
            <HStack justify="space-between" w="full">
              <HStack gap={2}>
                <Box
                  w="28px"
                  h="28px"
                  borderRadius="8px"
                  bg="bg.subtle"
                  border="1px solid"
                  borderColor="border.default"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Film size={14} className="text-slate-400" />
                </Box>
                <Dialog.Title fontWeight="700" fontSize="sm" color="text.primary">
                  Output tools
                </Dialog.Title>
              </HStack>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" borderRadius="nav" />
              </Dialog.CloseTrigger>
            </HStack>
          </Dialog.Header>

          <Dialog.Body px={5} py={4}>
            <Stack gap={4}>
              {taskId && (
                <Box
                  bg="bg.subtle"
                  borderRadius="input"
                  px={3}
                  py={2.5}
                  border="1px solid"
                  borderColor="border.default"
                >
                  <Text fontSize="xs" fontWeight="700" color="text.secondary" mb={1}>
                    Task ID
                  </Text>
                  <Text fontSize="xs" fontFamily="mono" color="text.primary" wordBreak="break-all">
                    {taskId}
                  </Text>
                </Box>
              )}

              {videos.length > 1 && (
                <Stack gap={2}>
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    color="text.secondary"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Select output ({videos.length})
                  </Text>
                  {videos.map((url, i) => (
                    <Box
                      key={url}
                      as="button"
                      type="button"
                      w="full"
                      textAlign="left"
                      px={3}
                      py={2.5}
                      borderRadius="input"
                      border="1px solid"
                      borderColor={i === activeIndex ? 'blue.500' : 'border.default'}
                      bg={i === activeIndex ? 'bg.active' : 'bg.subtle'}
                      cursor="pointer"
                      transition="all 0.15s"
                      _hover={{ borderColor: 'blue.500' }}
                      onClick={() => onSelectVideo(i)}
                    >
                      <HStack justify="space-between" gap={2}>
                        <Text fontSize="xs" fontFamily="mono" color="text.primary" truncate>
                          {fileName(url)}
                        </Text>
                        {i === activeIndex && (
                          <Badge colorPalette="blue" variant="subtle" fontSize="xs" borderRadius="badge">
                            Active
                          </Badge>
                        )}
                      </HStack>
                    </Box>
                  ))}
                </Stack>
              )}

              {activeUrl && (
                <Box
                  bg="bg.subtle"
                  borderRadius="input"
                  px={3}
                  py={2.5}
                  border="1px solid"
                  borderColor="border.default"
                >
                  <Text fontSize="xs" fontWeight="700" color="text.secondary" mb={1}>
                    Current file
                  </Text>
                  <Text fontSize="xs" fontFamily="mono" color="text.primary" truncate>
                    {fileName(activeUrl)}
                  </Text>
                </Box>
              )}

              <Stack gap={2}>
                <a href={activeUrl} download style={{ width: '100%' }}>
                  <Button w="full" size="sm" colorPalette="blue" borderRadius="btn" fontWeight="700">
                    <Download size={14} />
                    Download
                  </Button>
                </a>

                <HStack gap={2}>
                  <a href={activeUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }}>
                    <Button w="full" size="sm" variant="outline" borderRadius="btn" fontWeight="700">
                      <ExternalLink size={14} />
                      Open
                    </Button>
                  </a>
                  <IconButton
                    aria-label="Copy URL"
                    size="sm"
                    variant="outline"
                    borderRadius="btn"
                    onClick={() => void copyUrl()}
                  >
                    <Copy size={14} />
                  </IconButton>
                </HStack>

                {copied && (
                  <Text fontSize="xs" color="green.500" fontWeight="600" textAlign="center">
                    URL copied
                  </Text>
                )}
              </Stack>
            </Stack>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
