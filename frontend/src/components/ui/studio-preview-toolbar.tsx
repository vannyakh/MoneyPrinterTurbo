import { useState } from 'react'
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  Portal,
  Text,
} from '@chakra-ui/react'
import {
  Copy,
  Download,
  ExternalLink,
  PanelLeft,
  PanelLeftClose,
  RotateCcw,
  Sidebar,
} from 'lucide-react'
import { Tooltip } from './tooltip'
import { useCreateStudioStore } from '../../store/create-studio-store'
import { usePreviewOutputStore } from '../../store/preview-output-store'
import { useSidebarStore } from '../../store/sidebar-store'

function fileName(url: string) {
  return url.split('/').pop() ?? url
}

const toolbarBtn = {
  size: 'xs' as const,
  variant: 'ghost' as const,
  color: 'white',
  borderRadius: 'nav',
  _hover: { bg: 'whiteAlpha.200' },
}

export function StudioPreviewToolbar() {
  const [copied, setCopied] = useState(false)

  const optionsCollapsed = useCreateStudioStore((s) => s.optionsCollapsed)
  const toggleOptions = useCreateStudioStore((s) => s.toggleOptions)
  const setOptionsCollapsed = useCreateStudioStore((s) => s.setOptionsCollapsed)
  const resetPanelWidth = useCreateStudioStore((s) => s.resetPanelWidth)

  const { collapsed: navCollapsed, toggle: toggleNav } = useSidebarStore()

  const ready = usePreviewOutputStore((s) => s.ready)
  const videos = usePreviewOutputStore((s) => s.videos)
  const activeIndex = usePreviewOutputStore((s) => s.activeIndex)
  const activeUrl = usePreviewOutputStore((s) => s.activeUrl)
  const setActiveIndex = usePreviewOutputStore((s) => s.setActiveIndex)

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
    <Flex
      h="44px"
      flexShrink={0}
      align="center"
      justify="space-between"
      gap={3}
      px={3}
      borderBottom="1px solid"
      borderColor="whiteAlpha.100"
      bg="rgba(0,0,0,0.92)"
      backdropFilter="blur(10px)"
    >
      <HStack gap={1} minW={0}>
        {optionsCollapsed && (
          <Tooltip content="Show options panel">
            <IconButton
              aria-label="Show options panel"
              {...toolbarBtn}
              onClick={() => setOptionsCollapsed(false)}
            >
              <PanelLeft size={14} />
            </IconButton>
          </Tooltip>
        )}

        {ready && activeUrl && (
          <>
            {videos.length > 1 ? (
              <Menu.Root positioning={{ placement: 'bottom-start' }}>
                <Menu.Trigger asChild>
                  <Box
                    as="button"
                    type="button"
                    px={2.5}
                    py={1}
                    borderRadius="nav"
                    border="1px solid"
                    borderColor="whiteAlpha.200"
                    bg="whiteAlpha.100"
                    color="white"
                    fontSize="xs"
                    fontWeight="600"
                    fontFamily="mono"
                    maxW="200px"
                    truncate
                    _hover={{ bg: 'whiteAlpha.200' }}
                  >
                    {fileName(activeUrl)}
                  </Box>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content
                      bg="bg.surface"
                      borderColor="border.default"
                      borderRadius="input"
                      minW="220px"
                      py={1}
                    >
                      {videos.map((url, i) => (
                        <Menu.Item
                          key={url}
                          value={url}
                          fontSize="xs"
                          fontFamily="mono"
                          fontWeight={i === activeIndex ? 700 : 500}
                          color={i === activeIndex ? 'blue.500' : 'text.primary'}
                          onClick={() => setActiveIndex(i)}
                        >
                          {fileName(url)}
                        </Menu.Item>
                      ))}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            ) : (
              <Text fontSize="xs" fontWeight="600" fontFamily="mono" color="whiteAlpha.800" truncate maxW="200px">
                {fileName(activeUrl)}
              </Text>
            )}
          </>
        )}

        {!ready && (
          <Text fontSize="xs" fontWeight="600" color="whiteAlpha.500">
            Preview
          </Text>
        )}
      </HStack>

      <HStack gap={1} flexShrink={0}>
        {ready && activeUrl && (
          <>
            <Tooltip content="Download">
              <IconButton aria-label="Download video" {...toolbarBtn} asChild>
                <a href={activeUrl} download>
                  <Download size={14} />
                </a>
              </IconButton>
            </Tooltip>

            <Tooltip content="Open in new tab">
              <IconButton aria-label="Open video" {...toolbarBtn} asChild>
                <a href={activeUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} />
                </a>
              </IconButton>
            </Tooltip>

            <Tooltip content={copied ? 'Copied!' : 'Copy URL'}>
              <IconButton aria-label="Copy video URL" {...toolbarBtn} onClick={() => void copyUrl()}>
                <Copy size={14} />
              </IconButton>
            </Tooltip>

            <Box w="1px" h="18px" bg="whiteAlpha.200" mx={0.5} />
          </>
        )}

        <Tooltip content={optionsCollapsed ? 'Show options' : 'Hide options'}>
          <IconButton
            aria-label={optionsCollapsed ? 'Show options panel' : 'Hide options panel'}
            {...toolbarBtn}
            onClick={toggleOptions}
          >
            {optionsCollapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}
          </IconButton>
        </Tooltip>

        <Tooltip content="Reset panel width">
          <IconButton
            aria-label="Reset panel width"
            {...toolbarBtn}
            onClick={resetPanelWidth}
            display={{ base: 'none', lg: 'inline-flex' }}
          >
            <RotateCcw size={14} />
          </IconButton>
        </Tooltip>

        <Tooltip content={navCollapsed ? 'Show sidebar' : 'Hide sidebar'}>
          <IconButton
            aria-label={navCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            {...toolbarBtn}
            onClick={toggleNav}
          >
            <Sidebar size={14} />
          </IconButton>
        </Tooltip>
      </HStack>
    </Flex>
  )
}
