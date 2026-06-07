import { useEffect, useRef, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import DotGridLoader from '../DotGridLoader'
import { contentFade } from '../../lib/motion'
import { CustomVideoPlayer } from './custom-video-player'
import { useTask } from '../../hooks/use-tasks'
import { usePreviewOutputStore } from '../../store/preview-output-store'
import { useVideoStore } from '../../store/video-store'
import {
  fitAspectBox,
  getRenderStatus,
  isTaskActive,
  isTaskDone,
  isTaskFailed,
  parseVideoAspect,
} from '../../lib/task-status'
import { getTaskFinalVideo, getTaskPreviewVideoIndex, getTaskVideos } from '../../lib/task-utils'

export function OutputPreviewPanel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 480, height: 640 })

  const { taskId, videoAspect } = useVideoStore()
  const { data: task } = useTask(taskId)
  const setSnapshot = usePreviewOutputStore((s) => s.setSnapshot)
  const resetOutput = usePreviewOutputStore((s) => s.reset)
  const storeActiveIndex = usePreviewOutputStore((s) => s.activeIndex)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const rect = el.getBoundingClientRect()
      setContainerSize({
        width: Math.floor(rect.width),
        height: Math.floor(rect.height),
      })
    }
    update()
    const obs = new ResizeObserver(update)
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const videos = task ? getTaskVideos(task) : []
  const active = isTaskActive(task?.state)
  const done = isTaskDone(task?.state)
  const failed = isTaskFailed(task?.state)
  const renderStatus = getRenderStatus(task)

  const { ratioW, ratioH } = parseVideoAspect(videoAspect)
  const loaderBox = fitAspectBox(containerSize.width, containerSize.height, ratioW, ratioH)
  const playerBox = fitAspectBox(containerSize.width, containerSize.height, ratioW, ratioH)

  const activeIndex = done
    ? Math.min(storeActiveIndex, Math.max(0, videos.length - 1))
    : 0

  const activeUrl =
    videos[activeIndex] ?? (task && done ? getTaskFinalVideo(task) : null) ?? videos[0]

  useEffect(() => {
    if (!taskId || !task) {
      resetOutput()
      return
    }

    if (done && videos.length > 0) {
      const idx = getTaskPreviewVideoIndex(task)
      setSnapshot({
        ready: true,
        taskId,
        videos,
        activeIndex: idx,
        activeUrl: videos[idx] ?? getTaskFinalVideo(task),
      })
      return
    }

    resetOutput()
  }, [taskId, task, done, videos.length, setSnapshot, resetOutput])

  return (
    <Box
      ref={containerRef}
      flex="1"
      minH={0}
      h="full"
      w="full"
      display="flex"
      flexDirection="column"
      bg="#000000"
      overflow="hidden"
    >
      <AnimatePresence mode="wait">
        {!taskId && (
          <motion.div
            key="blank"
            variants={contentFade}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}
          >
            <Text fontSize="sm" color="whiteAlpha.500" fontWeight="600">
              Generated video will appear here
            </Text>
          </motion.div>
        )}

        {taskId && active && (
          <motion.div
            key="generating"
            variants={contentFade}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex' }}
          >
            <Flex flex="1" align="center" justify="center" minH={0} w="full" h="full">
              <DotGridLoader
                width={loaderBox.width}
                height={loaderBox.height}
                progress={task?.progress ?? 0}
                jobId={taskId.slice(0, 8)}
                status={renderStatus}
              />
            </Flex>
          </motion.div>
        )}

        {taskId && (done || failed) && (
          <motion.div
            key="result"
            variants={contentFade}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Flex flex={1} align="center" justify="center" minH={0} w="full" h="full" position="relative">
              {failed && (
                <Box
                  position="absolute"
                  top={4}
                  left="50%"
                  transform="translateX(-50%)"
                  zIndex={2}
                  w="full"
                  maxW="560px"
                  px={4}
                  bg="rgba(127,29,29,0.35)"
                  border="1px solid"
                  borderColor="red.800"
                  borderRadius="card"
                  py={3}
                >
                  <Text fontWeight="600" fontSize="sm" color="red.200" textAlign="center">
                    Video generation failed. Please check your settings and try again.
                  </Text>
                </Box>
              )}

              {activeUrl && (
                <CustomVideoPlayer
                  fill
                  src={activeUrl}
                  width={playerBox.width}
                  height={playerBox.height}
                />
              )}

              {!activeUrl && done && (
                <Text fontSize="sm" color="whiteAlpha.500" fontWeight="600">
                  No video output available
                </Text>
              )}
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}
