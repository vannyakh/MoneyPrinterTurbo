import { useEffect, useState } from 'react'
import {
  Badge,
  Box,
  Card,
  Flex,
  HStack,
  IconButton,
  Skeleton,
  Stack,
  Status,
  Text,
} from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { FileText, Film, Hash, Trash2, X } from 'lucide-react'
import DotGridLoader from '../DotGridLoader'
import { CustomVideoPlayer } from './custom-video-player'
import { useTask } from '../../hooks/use-tasks'
import { fadeUpItem, panelSlide, staggerContainer } from '../../lib/motion'
import {
  getRenderStatus,
  getTaskStateMeta,
  isTaskActive,
  isTaskDone,
  isTaskFailed,
} from '../../lib/task-status'
import {
  formatTaskId,
  getTaskMaterials,
  getTaskFinalVideo,
  getTaskPrimaryVideo,
  getTaskPreviewVideoIndex,
  getTaskTerms,
  getTaskVideos,
} from '../../lib/task-utils'

const cardStyle = {
  bg: 'bg.surface',
  borderColor: 'border.default',
  borderRadius: 'card',
  shadow: 'sm',
} as const

const sectionLabel = {
  fontSize: 'xs',
  fontWeight: '700',
  color: 'text.secondary',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
} as const

const sourceBlockStyle = {
  bg: 'bg.subtle',
  borderRadius: 'input',
  border: '1px solid',
  borderColor: 'border.default',
  px: 3,
  py: 2.5,
} as const

type TaskPreviewPanelProps = {
  taskId: string
  onClose: () => void
  onDelete: (id: string) => void
}

function SourceSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <motion.div variants={fadeUpItem}>
      <Box {...sourceBlockStyle}>
        <HStack gap={2} mb={2}>
          <Box
            w="22px"
            h="22px"
            borderRadius="6px"
            bg="bg.surface"
            border="1px solid"
            borderColor="border.default"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <Icon size={12} className="text-slate-400" />
          </Box>
          <Text fontSize="xs" fontWeight="700" color="text.primary">
            {title}
          </Text>
        </HStack>
        {children}
      </Box>
    </motion.div>
  )
}

export function TaskPreviewPanel({ taskId, onClose, onDelete }: TaskPreviewPanelProps) {
  const { data: task, isLoading } = useTask(taskId)
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)

  const videos = task ? getTaskVideos(task) : []
  const done = task ? isTaskDone(task.state) : false
  const activeUrl =
    videos[activeVideoIndex] ?? (task && done ? getTaskFinalVideo(task) : null) ?? videos[0]

  useEffect(() => {
    if (!task) {
      setActiveVideoIndex(0)
      return
    }
    setActiveVideoIndex(isTaskDone(task.state) ? getTaskPreviewVideoIndex(task) : 0)
  }, [taskId, task?.state, videos.length, task])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={taskId}
        variants={panelSlide}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ height: '100%' }}
      >
        <Card.Root
          {...cardStyle}
          overflow="hidden"
          h="full"
          display="flex"
          flexDirection="column"
          borderColor="blue.500"
          borderWidth="1px"
          shadow="md"
        >
          {isLoading || !task ? (
            <Card.Body>
              <Stack gap={3} py={8}>
                <Skeleton h="180px" borderRadius="input" />
                <Skeleton h="8px" borderRadius="full" />
                <Skeleton h="60px" borderRadius="input" />
                <Skeleton h="60px" borderRadius="input" />
              </Stack>
            </Card.Body>
          ) : (
            <>
              <Card.Header borderBottom="1px solid" borderColor="border.default" py={3} px={4} bg="bg.subtle">
                <Flex justify="space-between" align="start" gap={3}>
                  <Stack gap={1.5} flex={1} minW={0}>
                    <HStack gap={2} flexWrap="wrap">
                      <Status.Root colorPalette={getTaskStateMeta(task.state).statusPalette} size="sm">
                        <Status.Indicator />
                      </Status.Root>
                      <Badge
                        colorPalette={getTaskStateMeta(task.state).palette}
                        variant="subtle"
                        borderRadius="badge"
                        fontWeight="700"
                        fontSize="xs"
                      >
                        {getTaskStateMeta(task.state).label}
                      </Badge>
                    </HStack>
                    <Text fontFamily="mono" fontSize="xs" fontWeight="600" color="text.secondary" truncate>
                      {task.task_id}
                    </Text>
                  </Stack>
                  <HStack gap={1} flexShrink={0}>
                    <IconButton
                      aria-label="Delete task"
                      size="xs"
                      variant="ghost"
                      colorPalette="red"
                      borderRadius="nav"
                      onClick={() => onDelete(task.task_id)}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                    <IconButton
                      aria-label="Close preview"
                      size="xs"
                      variant="ghost"
                      borderRadius="nav"
                      onClick={onClose}
                    >
                      <X size={14} />
                    </IconButton>
                  </HStack>
                </Flex>
              </Card.Header>

              <Card.Body flex={1} overflowY="auto" px={4} py={4}>
                <motion.div variants={staggerContainer} initial="initial" animate="animate">
                  <Stack gap={5}>
                    <motion.div variants={fadeUpItem}>
                      <Box
                        borderRadius="input"
                        overflow="hidden"
                        bg="#000000"
                        border="1px solid"
                        borderColor="whiteAlpha.100"
                        minH="220px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {isTaskActive(task.state) && (
                          <DotGridLoader
                            width={340}
                            height={400}
                            progress={task.progress ?? 0}
                            jobId={formatTaskId(task.task_id, 8)}
                            status={getRenderStatus(task)}
                          />
                        )}

                        {isTaskDone(task.state) && activeUrl && (
                          <CustomVideoPlayer src={activeUrl} aspectRatio="16 / 9" />
                        )}

                        {isTaskFailed(task.state) && (
                          <Stack gap={2} align="center" px={6} py={8} textAlign="center">
                            <Text fontWeight="700" color="text.error" fontSize="sm">
                              Render failed
                            </Text>
                            <Text fontSize="xs" color="text.muted">
                              Check your API keys and settings, then try again.
                            </Text>
                          </Stack>
                        )}

                        {!isTaskActive(task.state) && !getTaskPrimaryVideo(task) && !isTaskFailed(task.state) && (
                          <Text fontSize="sm" color="whiteAlpha.500" fontWeight="600">
                            No preview available
                          </Text>
                        )}
                      </Box>
                    </motion.div>

                    {getTaskVideos(task).length > 0 && (
                      <SourceSection icon={Film} title={`Output (${getTaskVideos(task).length})`}>
                        <Stack gap={1}>
                          {getTaskVideos(task).map((url, i) => (
                            <button
                              key={url}
                              type="button"
                              onClick={() => setActiveVideoIndex(i)}
                              style={{
                                width: '100%',
                                padding: 0,
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '12px',
                                fontFamily: 'monospace',
                                fontWeight: i === activeVideoIndex ? 700 : 500,
                                color: i === activeVideoIndex ? 'var(--chakra-colors-blue-500)' : 'inherit',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {url.split('/').pop()}
                            </button>
                          ))}
                        </Stack>
                      </SourceSection>
                    )}

                    <Stack gap={3}>
                      <motion.div variants={fadeUpItem}>
                        <Text {...sectionLabel}>Source history</Text>
                      </motion.div>

                      {task.script && (
                        <SourceSection icon={FileText} title="Script">
                          <Text fontSize="xs" color="text.secondary" lineClamp={5} whiteSpace="pre-wrap">
                            {task.script}
                          </Text>
                        </SourceSection>
                      )}

                      {getTaskTerms(task).length > 0 && (
                        <SourceSection icon={Hash} title="Keywords">
                          <Flex gap={1.5} flexWrap="wrap">
                            {getTaskTerms(task).map((term) => (
                              <Badge
                                key={term}
                                variant="subtle"
                                colorPalette="gray"
                                fontSize="xs"
                                borderRadius="badge"
                              >
                                {term}
                              </Badge>
                            ))}
                          </Flex>
                        </SourceSection>
                      )}

                      {getTaskMaterials(task).length > 0 && (
                        <SourceSection icon={Film} title={`Materials (${getTaskMaterials(task).length})`}>
                          <Stack gap={1}>
                            {getTaskMaterials(task).slice(0, 8).map((name) => (
                              <Text key={name} fontSize="xs" fontFamily="mono" color="text.secondary" truncate>
                                {name}
                              </Text>
                            ))}
                            {getTaskMaterials(task).length > 8 && (
                              <Text fontSize="xs" color="text.muted">
                                +{getTaskMaterials(task).length - 8} more
                              </Text>
                            )}
                          </Stack>
                        </SourceSection>
                      )}

                      {!task.script && getTaskTerms(task).length === 0 && getTaskMaterials(task).length === 0 && (
                        <motion.div variants={fadeUpItem}>
                          <Text fontSize="xs" color="text.muted" px={1}>
                            Source details appear as the task progresses.
                          </Text>
                        </motion.div>
                      )}
                    </Stack>
                  </Stack>
                </motion.div>
              </Card.Body>

            </>
          )}
        </Card.Root>
      </motion.div>
    </AnimatePresence>
  )
}
