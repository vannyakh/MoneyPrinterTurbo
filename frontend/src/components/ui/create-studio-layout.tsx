import { useCallback, useEffect, useRef } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { OutputPreviewPanel } from './output-preview-panel'
import { StudioPreviewToolbar } from './studio-preview-toolbar'
import { VideoScriptForm } from './video-script-form'
import {
  STUDIO_PANEL_DEFAULT,
  STUDIO_PANEL_MAX,
  STUDIO_PANEL_MIN,
  useCreateStudioStore,
} from '../../store/create-studio-store'

function ResizeHandle({ onResizeStart }: { onResizeStart: (clientX: number) => void }) {
  return (
    <Box
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize options panel"
      w="5px"
      flexShrink={0}
      cursor="col-resize"
      position="relative"
      onMouseDown={(e) => {
        e.preventDefault()
        onResizeStart(e.clientX)
      }}
      _hover={{ '& > div': { bg: 'blue.400', opacity: 1 } }}
      display={{ base: 'none', lg: 'block' }}
    >
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left="2px"
        w="1px"
        bg="border.default"
        opacity={0.85}
        transition="background 0.15s, opacity 0.15s"
      />
    </Box>
  )
}

export function CreateStudioLayout() {
  const panelWidth = useCreateStudioStore((s) => s.panelWidth)
  const optionsCollapsed = useCreateStudioStore((s) => s.optionsCollapsed)
  const setPanelWidth = useCreateStudioStore((s) => s.setPanelWidth)

  const resizeRef = useRef({ startX: 0, startWidth: STUDIO_PANEL_DEFAULT })

  const startResize = useCallback(
    (clientX: number) => {
      resizeRef.current = { startX: clientX, startWidth: panelWidth }

      const onMove = (e: MouseEvent) => {
        const delta = e.clientX - resizeRef.current.startX
        setPanelWidth(resizeRef.current.startWidth + delta)
      }

      const onUp = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    },
    [panelWidth, setPanelWidth],
  )

  useEffect(() => {
    return () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [])

  return (
    <Flex
      h="full"
      w="full"
      overflow="hidden"
      bg="bg.canvas"
      direction={{ base: 'column', lg: 'row' }}
      position="relative"
    >
      {!optionsCollapsed && (
        <Flex
          direction="column"
          h={{ base: '45vh', lg: 'full' }}
          w={{ base: 'full', lg: `${panelWidth}px` }}
          minW={{ lg: `${STUDIO_PANEL_MIN}px` }}
          maxW={{ lg: `${STUDIO_PANEL_MAX}px` }}
          flexShrink={0}
          overflow="hidden"
          borderRight={{ lg: 'none' }}
          borderBottom={{ base: '1px solid', lg: 'none' }}
          borderColor="border.default"
          bg="bg.canvas"
        >
          <VideoScriptForm />
        </Flex>
      )}

      {!optionsCollapsed && <ResizeHandle onResizeStart={startResize} />}

      <Box
        flex={1}
        minW={0}
        minH={0}
        h="full"
        overflow="hidden"
        bg="#000000"
        display="flex"
        flexDirection="column"
      >
        <StudioPreviewToolbar />
        <OutputPreviewPanel />
      </Box>
    </Flex>
  )
}
