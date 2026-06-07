import { useEffect, useRef, useState } from 'react'
import {
  Badge,
  Box,
  Card,
  Flex,
  HStack,
  Progress,
  Stack,
  Status,
  Text,
} from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, ExternalLink } from 'lucide-react'
// @ts-ignore – plain-JS canvas loader component
import DotGridLoader from '../DotGridLoader'
import { useTask } from '../../hooks/use-tasks'
import { useVideoStore } from '../../store/video-store'

// ── Resolution presets ────────────────────────────────────────────────────────
const RESOLUTIONS = [
  { id: '16:9', label: '16:9', ratioW: 16, ratioH: 9  },
  { id: '9:16', label: '9:16', ratioW: 9,  ratioH: 16 },
  { id: '1:1',  label: '1:1',  ratioW: 1,  ratioH: 1  },
  { id: '4:3',  label: '4:3',  ratioW: 4,  ratioH: 3  },
] as const

type ResId = typeof RESOLUTIONS[number]['id']

// ── Task state map ────────────────────────────────────────────────────────────
const STATE = {
  0: { label: 'Pending',    palette: 'gray',  statusPalette: 'yellow' },
  1: { label: 'Processing', palette: 'blue',  statusPalette: 'blue'   },
  2: { label: 'Completed',  palette: 'green', statusPalette: 'green'  },
  3: { label: 'Failed',     palette: 'red',   statusPalette: 'red'    },
} as const

type StateKey = keyof typeof STATE

// DotGridLoader has 48px HUD + 52px footer + 32px vertical canvas padding
const LOADER_OVERHEAD = 132
const MAX_LOADER_H    = 560

function loaderDims(containerW: number, ratioW: number, ratioH: number) {
  const rawCanvasW = containerW - 32
  const rawCanvasH = Math.round(rawCanvasW * ratioH / ratioW)
  const maxCanvasH = MAX_LOADER_H - LOADER_OVERHEAD
  const canvasH    = Math.min(rawCanvasH, maxCanvasH)
  const canvasW    = Math.round(canvasH * ratioW / ratioH)
  return { w: canvasW + 32, h: canvasH + LOADER_OVERHEAD }
}

export function OutputPreviewPanel() {
  const resolution: ResId = '16:9'
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerW, setContainerW] = useState(480)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setContainerW(Math.floor(el.getBoundingClientRect().width))
    update()
    const obs = new ResizeObserver(update)
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const { taskId } = useVideoStore()
  const { data: task } = useTask(taskId)
  const videos    = task ? [...(task.combined_videos ?? []), ...(task.videos ?? [])] : []
  const s         = task ? (STATE[task.state as StateKey] ?? { label: 'Unknown', palette: 'gray', statusPalette: 'gray' }) : null
  const isActive  = task?.state === 0 || task?.state === 1
  const isDone    = task?.state === 2
  const isFailed  = task?.state === 3

  const res    = RESOLUTIONS.find(r => r.id === resolution)!
  const loader = loaderDims(containerW, res.ratioW, res.ratioH)
  const aspect = `${res.ratioW} / ${res.ratioH}`

  return (
    <Box ref={containerRef}>
      <Stack gap={5}>
        {/* ── Content area ──────────────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* Blank — no task started */}
          {!taskId && (
            <motion.div key="blank" initial={{ opacity: 0 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} />
          )}

          {/* Generating — DotGridLoader */}
          {taskId && isActive && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <Stack gap={4}>
                {/* Loader canvas */}
                <Flex justify="center">
                  <DotGridLoader
                    width={loader.w}
                    height={loader.h}
                    showControls
                    autoProgress
                    jobId={taskId.slice(0, 8)}
                  />
                </Flex>

                {/* Real task progress */}
                <Card.Root
                  bg="bg.surface"
                  borderColor="border.default"
                  borderRadius="card"
                  shadow="sm"
                >
                  <Card.Body>
                    <Stack gap={3}>
                      <HStack justify="space-between">
                        <HStack gap={2.5}>
                          <Status.Root colorPalette={s?.statusPalette ?? 'gray'} size="sm">
                            <Status.Indicator />
                          </Status.Root>
                          <Text fontWeight="700" fontSize="sm" color="text.primary">
                            {s?.label ?? 'Unknown'}
                          </Text>
                        </HStack>
                        <Text fontFamily="mono" fontSize="xs" fontWeight="600" color="text.muted">
                          {taskId.slice(0, 12)}…
                        </Text>
                      </HStack>

                      <Stack gap={1.5}>
                        <HStack justify="space-between">
                          <Text fontSize="xs" fontWeight="600" color="text.secondary">Progress</Text>
                          <Text fontSize="xs" fontWeight="700" color="text.primary">
                            {task?.progress ?? 0}%
                          </Text>
                        </HStack>
                        <Progress.Root value={task?.progress ?? 0} max={100} colorPalette="blue" size="sm">
                          <Progress.Track borderRadius="full">
                            <Progress.Range />
                          </Progress.Track>
                        </Progress.Root>
                      </Stack>
                    </Stack>
                  </Card.Body>
                </Card.Root>
              </Stack>
            </motion.div>
          )}

          {/* Completed / failed */}
          {taskId && (isDone || isFailed) && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <Stack gap={4}>
                {/* Status bar */}
                <Card.Root
                  bg="bg.surface"
                  borderColor="border.default"
                  borderRadius="card"
                  shadow="sm"
                >
                  <Card.Body>
                    <Stack gap={3}>
                      <HStack justify="space-between">
                        <HStack gap={2.5}>
                          <Status.Root colorPalette={s?.statusPalette ?? 'gray'} size="sm">
                            <Status.Indicator />
                          </Status.Root>
                          <Text fontWeight="700" fontSize="sm" color="text.primary">
                            {s?.label ?? 'Unknown'}
                          </Text>
                        </HStack>
                        <HStack gap={2}>
                          {videos.length > 0 && (
                            <Badge
                              colorPalette="green"
                              variant="subtle"
                              borderRadius="badge"
                              fontWeight="700"
                              fontSize="xs"
                              px={2.5}
                            >
                              {videos.length} video{videos.length !== 1 ? 's' : ''}
                            </Badge>
                          )}
                          <Text fontFamily="mono" fontSize="xs" fontWeight="600" color="text.muted">
                            {taskId.slice(0, 12)}…
                          </Text>
                        </HStack>
                      </HStack>

                      <Progress.Root
                        value={task?.progress ?? 0}
                        max={100}
                        colorPalette={isDone ? 'green' : 'red'}
                        size="sm"
                      >
                        <Progress.Track borderRadius="full">
                          <Progress.Range />
                        </Progress.Track>
                      </Progress.Root>
                    </Stack>
                  </Card.Body>
                </Card.Root>

                {/* Failed banner */}
                {isFailed && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scaleY: 0.94 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  >
                    <Box
                      bg="bg.error"
                      border="1px solid"
                      borderColor="border.error"
                      borderRadius="card"
                      px={4}
                      py={3}
                    >
                      <Text fontWeight="600" fontSize="sm" color="text.error">
                        Video generation failed. Please check your settings and try again.
                      </Text>
                    </Box>
                  </motion.div>
                )}

                {/* Video list */}
                {videos.map((url) => (
                  <Stack key={url} gap={3}>
                    {/* Player — aspect ratio matches selected resolution */}
                    <Box
                      borderRadius="16px"
                      overflow="hidden"
                      bg="black"
                      aspectRatio={aspect}
                      boxShadow="0 4px 28px rgba(0,0,0,0.22)"
                    >
                      <video
                        src={url}
                        controls
                        preload="metadata"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </Box>

                    <Text
                      fontSize="xs"
                      fontFamily="mono"
                      fontWeight="600"
                      color="text.muted"
                      truncate
                    >
                      {url.split('/').at(-1)}
                    </Text>

                    <HStack gap={2}>
                      <Box flex={1}>
                        <a href={url} download style={{ display: 'block', width: '100%' }}>
                          <Box
                            w="full"
                            bg="blue.500"
                            color="white"
                            borderRadius="btn"
                            py="9px"
                            px={4}
                            fontWeight="700"
                            fontSize="sm"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            gap={2}
                            cursor="pointer"
                            _hover={{ bg: 'blue.600' }}
                            transition="background 0.15s"
                          >
                            <Download size={14} />
                            Download
                          </Box>
                        </a>
                      </Box>

                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <Box
                          borderRadius="btn"
                          py="9px"
                          px={4}
                          fontWeight="700"
                          fontSize="sm"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          gap={2}
                          border="1px solid"
                          borderColor="border.default"
                          color="text.primary"
                          cursor="pointer"
                          _hover={{ bg: 'bg.hover' }}
                          transition="background 0.15s"
                        >
                          <ExternalLink size={14} />
                          Open
                        </Box>
                      </a>
                    </HStack>
                  </Stack>
                ))}
              </Stack>
            </motion.div>
          )}

        </AnimatePresence>
      </Stack>
    </Box>
  )
}
