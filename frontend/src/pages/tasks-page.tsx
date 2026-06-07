import {
  Box,
  Button,
  Card,
  Drawer,
  EmptyState,
  Flex,
  Heading,
  HStack,
  IconButton,
  Portal,
  Skeleton,
  Spinner,
  Stack,
  Table,
  Text,
} from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutGrid, List, ListVideo, RefreshCw, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DotGridLoader from '../components/DotGridLoader'
import { TaskPreviewPanel } from '../components/ui/task-preview-panel'
import { TaskVideoPoster } from '../components/ui/task-video-poster'
import { Tooltip } from '../components/ui/tooltip'
import { ROUTES } from '../constants/routes'
import { useDeleteTask, useTasks } from '../hooks/use-tasks'
import {
  fadeUpItem,
  panelSlide,
  staggerContainer,
  viewSwitch,
} from '../lib/motion'
import {
  getRenderStatus,
  isTaskActive,
  isTaskFailed,
} from '../lib/task-status'
import {
  formatTaskId,
  getTaskFinalVideo,
} from '../lib/task-utils'
import type { Task, TaskViewMode } from '../types/task'

const VIEW_MODE_KEY = 'mpt-tasks-view'
const XL_MEDIA_QUERY = '(min-width: 80em)'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    setMatches(mq.matches)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

const cardStyle = {
  bg: 'bg.surface',
  borderColor: 'border.default',
  borderRadius: 'card',
  shadow: 'none',
} as const

const MotionBox = motion.create(Box)

function useViewMode() {
  const [viewMode, setViewMode] = useState<TaskViewMode>(() => {
    const saved = localStorage.getItem(VIEW_MODE_KEY)
    return saved === 'list' ? 'list' : 'grid'
  })

  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode)
  }, [viewMode])

  return [viewMode, setViewMode] as const
}

function TaskThumb({ task, selected }: { task: Task; selected: boolean }) {
  const finalVideo = getTaskFinalVideo(task)
  const active = isTaskActive(task.state)
  const failed = isTaskFailed(task.state)
  const renderStatus = getRenderStatus(task)
  const progress = task.progress ?? 0

  return (
    <Box aspectRatio="16/9" bg="black" position="relative" overflow="hidden" w="full">
      {finalVideo && !active && <TaskVideoPoster src={finalVideo} />}

      {active && (
        <Box position="absolute" inset={0}>
          <DotGridLoader
            fill
            compact
            progress={progress}
            jobId={formatTaskId(task.task_id, 8)}
            status={renderStatus}
          />
        </Box>
      )}

      {failed && !finalVideo && (
        <Flex align="center" justify="center" h="full" bg="rgba(127,29,29,0.45)">
          <Text fontSize="xs" fontWeight="700" color="red.200">
            Failed
          </Text>
        </Flex>
      )}

      {!finalVideo && !active && !failed && (
        <Flex align="center" justify="center" h="full" bg="bg.subtle">
          <ListVideo size={28} className="text-slate-400 dark:text-slate-500" />
        </Flex>
      )}

      {selected && (
        <Box position="absolute" inset={0} border="2px solid" borderColor="blue.500" pointerEvents="none" />
      )}
    </Box>
  )
}

function TaskGridCard({
  task,
  selected,
  onSelect,
  onDelete,
}: {
  task: Task
  selected: boolean
  onSelect: () => void
  onDelete: (id: string) => void
}) {
  return (
    <motion.div variants={fadeUpItem}>
      <Card.Root
        {...cardStyle}
        w="full"
        p={0}
        borderColor={selected ? 'blue.500' : 'border.default'}
        borderWidth={selected ? '2px' : '1px'}
        overflow="hidden"
        cursor="pointer"
        onClick={onSelect}
      >
        <Box position="relative">
          <TaskThumb task={task} selected={selected} />

          <Box position="absolute" top={2} right={2}>
            <IconButton
              aria-label="Delete task"
              size="xs"
              variant="solid"
              bg="blackAlpha.700"
              color="white"
              borderRadius="full"
              border="1px solid"
              borderColor="whiteAlpha.300"
              opacity={0.85}
              _hover={{ bg: 'red.600', opacity: 1 }}
              onClick={(e) => {
                e.stopPropagation()
                onDelete(task.task_id)
              }}
            >
              <Trash2 size={13} />
            </IconButton>
          </Box>
        </Box>
      </Card.Root>
    </motion.div>
  )
}

function TaskListRow({
  task,
  selected,
  onSelect,
  onDelete,
}: {
  task: Task
  selected: boolean
  onSelect: () => void
  onDelete: (id: string) => void
}) {
  const finalVideo = getTaskFinalVideo(task)
  const active = isTaskActive(task.state)
  const failed = isTaskFailed(task.state)
  const renderStatus = getRenderStatus(task)

  return (
    <Table.Row
      bg={selected ? 'bg.active' : undefined}
      cursor="pointer"
      transition="background 0.2s"
      _hover={{ bg: selected ? 'bg.active' : 'bg.subtle' }}
      onClick={onSelect}
    >
      <Table.Cell w="140px">
        <Box
          w="120px"
          aspectRatio="16/9"
          borderRadius="input"
          overflow="hidden"
          bg="black"
          border="1px solid"
          borderColor={selected ? 'blue.500' : 'border.default'}
        >
          {active ? (
            <DotGridLoader
              fill
              compact
              progress={task.progress ?? 0}
              jobId={formatTaskId(task.task_id, 8)}
              status={renderStatus}
            />
          ) : finalVideo ? (
            <TaskVideoPoster src={finalVideo} />
          ) : failed ? (
            <Flex align="center" justify="center" h="full" bg="rgba(127,29,29,0.35)">
              <Text fontSize="xs" fontWeight="700" color="red.300">
                Failed
              </Text>
            </Flex>
          ) : (
            <Flex align="center" justify="center" h="full" bg="bg.subtle">
              <ListVideo size={16} className="text-slate-400" />
            </Flex>
          )}
        </Box>
      </Table.Cell>

      <Table.Cell>
        <Text fontFamily="mono" fontSize="xs" fontWeight="700" color="text.primary">
          {formatTaskId(task.task_id, 14)}
        </Text>
      </Table.Cell>

      <Table.Cell w="48px">
        <IconButton
          aria-label="Delete task"
          size="xs"
          colorPalette="red"
          variant="ghost"
          borderRadius="nav"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(task.task_id)
          }}
        >
          <Trash2 size={14} />
        </IconButton>
      </Table.Cell>
    </Table.Row>
  )
}

function GridSkeleton() {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: '1fr',
        md: 'repeat(2, minmax(0, 1fr))',
        xl: 'repeat(3, minmax(0, 1fr))',
        '2xl': 'repeat(4, minmax(0, 1fr))',
      }}
      gap={4}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <Card.Root key={i} {...cardStyle} overflow="hidden">
          <Skeleton aspectRatio="16/9" w="full" />
        </Card.Root>
      ))}
    </Box>
  )
}

export default function TasksPage() {
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useViewMode()
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const isXlUp = useMediaQuery(XL_MEDIA_QUERY)
  const pageSize = 12

  const { data, isLoading, isFetching, refetch } = useTasks(page, pageSize)
  const deleteMutation = useDeleteTask()
  const totalPages = data ? Math.ceil(data.total / pageSize) : 1
  const hasTasks = (data?.tasks.length ?? 0) > 0

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
    if (selectedTaskId === id) setSelectedTaskId(null)
  }

  const gridCols = {
    base: '1fr',
    md: 'repeat(2, minmax(0, 1fr))',
    xl: selectedTaskId ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))',
    '2xl': selectedTaskId ? 'repeat(3, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))',
  } as const

  return (
    <Box flex={1} h="full" overflowY="auto" py={{ base: 6, md: 8 }} px={{ base: 4, md: 6, xl: 8 }} bg="bg.canvas" w="full">
        <Stack gap={6} w="full">
          {/* Header */}
          <Flex justify="space-between" align="start" gap={4} flexWrap="wrap">
            <Box>
              <Heading size="lg" fontWeight="800" color="text.primary">
                Tasks
              </Heading>
              <Text fontSize="sm" fontWeight="500" color="text.secondary" mt={1}>
                Click a video to preview output and source details.
              </Text>
            </Box>

            <HStack gap={2} flexWrap="wrap">
              {isFetching && !isLoading && <Spinner size="xs" color="blue.500" />}

              <HStack
                gap={0}
                bg="bg.subtle"
                borderRadius="input"
                p="3px"
                border="1px solid"
                borderColor="border.default"
              >
                <Tooltip content="Grid view">
                  <IconButton
                    aria-label="Grid view"
                    size="sm"
                    variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                    colorPalette={viewMode === 'grid' ? 'blue' : 'gray'}
                    borderRadius="8px"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid size={16} />
                  </IconButton>
                </Tooltip>
                <Tooltip content="List view">
                  <IconButton
                    aria-label="List view"
                    size="sm"
                    variant={viewMode === 'list' ? 'solid' : 'ghost'}
                    colorPalette={viewMode === 'list' ? 'blue' : 'gray'}
                    borderRadius="8px"
                    onClick={() => setViewMode('list')}
                  >
                    <List size={16} />
                  </IconButton>
                </Tooltip>
              </HStack>

              <Tooltip content="Refresh tasks">
                <motion.div whileTap={{ rotate: 180 }} transition={{ duration: 0.35 }}>
                  <IconButton
                    aria-label="Refresh tasks"
                    size="sm"
                    variant="outline"
                    borderRadius="nav"
                    borderColor="border.default"
                    onClick={() => refetch()}
                  >
                    <RefreshCw size={16} />
                  </IconButton>
                </motion.div>
              </Tooltip>
            </HStack>
          </Flex>

          {/* Main layout */}
          <Flex direction={{ base: 'column', xl: 'row' }} gap={6} align="start" w="full">
            <Box flex={1} minW={0} w="full">
              {!isLoading && !hasTasks ? (
                <Card.Root {...cardStyle}>
                  <Card.Body py={10}>
                    <EmptyState.Root>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <ListVideo size={38} className="text-slate-400 dark:text-slate-500" />
                        </EmptyState.Indicator>
                        <EmptyState.Title fontWeight="700" color="text.primary">
                          No tasks yet
                        </EmptyState.Title>
                        <EmptyState.Description color="text.secondary">
                          Go to Create to generate your first video.
                        </EmptyState.Description>
                      </EmptyState.Content>
                      <Flex justify="center" mt={5}>
                        <Link to={ROUTES.create}>
                          <Button colorPalette="blue" borderRadius="btn" fontWeight="700" size="sm">
                            Create a video
                          </Button>
                        </Link>
                      </Flex>
                    </EmptyState.Root>
                  </Card.Body>
                </Card.Root>
              ) : isLoading ? (
                viewMode === 'grid' ? (
                  <GridSkeleton />
                ) : (
                  <Card.Root {...cardStyle} overflow="hidden">
                    <Card.Body p={4}>
                      <Stack gap={3}>
                        {Array.from({ length: 6 }).map((_, i) => (
                          <Skeleton key={i} h="56px" borderRadius="input" />
                        ))}
                      </Stack>
                    </Card.Body>
                  </Card.Root>
                )
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewMode}
                    variants={viewSwitch}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {viewMode === 'grid' ? (
                      <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                      >
                        <Box display="grid" gridTemplateColumns={gridCols} gap={4}>
                          {data!.tasks.map((task) => (
                            <TaskGridCard
                              key={task.task_id}
                              task={task}
                              selected={selectedTaskId === task.task_id}
                              onSelect={() => setSelectedTaskId(task.task_id)}
                              onDelete={handleDelete}
                            />
                          ))}
                        </Box>
                      </motion.div>
                    ) : (
                      <Card.Root {...cardStyle} overflow="hidden">
                        <Card.Body p={0}>
                          <Table.Root>
                            <Table.Header>
                              <Table.Row bg="bg.subtle">
                                {['Preview', 'Task ID', ''].map((h) => (
                                  <Table.ColumnHeader
                                    key={h || 'actions'}
                                    fontWeight="700"
                                    fontSize="xs"
                                    color="text.secondary"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                    py={3}
                                  >
                                    {h}
                                  </Table.ColumnHeader>
                                ))}
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              {data!.tasks.map((task) => (
                                <TaskListRow
                                  key={task.task_id}
                                  task={task}
                                  selected={selectedTaskId === task.task_id}
                                  onSelect={() => setSelectedTaskId(task.task_id)}
                                  onDelete={handleDelete}
                                />
                              ))}
                            </Table.Body>
                          </Table.Root>
                        </Card.Body>
                      </Card.Root>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              {totalPages > 1 && (
                <HStack justify="flex-end" gap={2} mt={5}>
                  <Text fontSize="sm" fontWeight="600" color="text.secondary">
                    Page {page} / {totalPages}
                  </Text>
                  <IconButton
                    aria-label="Previous page"
                    size="xs"
                    variant="outline"
                    borderRadius="nav"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    ‹
                  </IconButton>
                  <IconButton
                    aria-label="Next page"
                    size="xs"
                    variant="outline"
                    borderRadius="nav"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    ›
                  </IconButton>
                </HStack>
              )}
            </Box>

            {/* Desktop preview panel */}
            <AnimatePresence>
              {selectedTaskId && isXlUp && (
                <MotionBox
                  key="preview-panel"
                  display={{ base: 'none', xl: 'block' }}
                  w="420px"
                  flexShrink={0}
                  position="sticky"
                  top={8}
                  alignSelf="start"
                  variants={panelSlide}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <TaskPreviewPanel
                    taskId={selectedTaskId}
                    onClose={() => setSelectedTaskId(null)}
                    onDelete={handleDelete}
                  />
                </MotionBox>
              )}
            </AnimatePresence>
          </Flex>

          {/* Mobile preview drawer */}
          <Drawer.Root
            open={!!selectedTaskId && !isXlUp}
            placement="bottom"
            onOpenChange={(e) => {
              if (!e.open) setSelectedTaskId(null)
            }}
          >
            <Portal>
              <Drawer.Backdrop bg="blackAlpha.700" backdropFilter="blur(4px)" />
              <Drawer.Positioner>
                <Drawer.Content
                  bg="bg.canvas"
                  borderTopRadius="card"
                  maxH="88vh"
                  h="88vh"
                  overflow="hidden"
                >
                  <Drawer.Body p={0} h="full" overflow="hidden">
                    {selectedTaskId && (
                      <TaskPreviewPanel
                        taskId={selectedTaskId}
                        onClose={() => setSelectedTaskId(null)}
                        onDelete={handleDelete}
                      />
                    )}
                  </Drawer.Body>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
        </Stack>
    </Box>
  )
}
