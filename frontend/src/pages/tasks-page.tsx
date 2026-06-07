import {
  Badge,
  Box,
  Button,
  Card,
  EmptyState,
  Flex,
  Heading,
  HStack,
  IconButton,
  Progress,
  Skeleton,
  Spinner,
  Stack,
  Status,
  Table,
  Text,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { ListVideo, RefreshCw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from '../components/ui/tooltip'
import { PageShell } from '../components/ui/page-shell'
import { ROUTES } from '../constants/routes'
import { useDeleteTask, useTasks } from '../hooks/use-tasks'
import type { Task } from '../types/task'

const STATE: Record<number, { label: string; palette: string; statusPalette: string }> = {
  0: { label: 'Pending',    palette: 'gray',  statusPalette: 'yellow' },
  1: { label: 'Processing', palette: 'blue',  statusPalette: 'blue'   },
  2: { label: 'Completed',  palette: 'green', statusPalette: 'green'  },
  3: { label: 'Failed',     palette: 'red',   statusPalette: 'red'    },
}

const COLS = ['Task ID', 'Status', 'Progress', 'Videos', '']

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <Table.Row key={`sk-${i}`}>
          <Table.Cell>
            <Skeleton h="13px" w="76px" borderRadius="6px" />
          </Table.Cell>
          <Table.Cell>
            <HStack gap={2}>
              <Skeleton w="8px" h="8px" borderRadius="full" />
              <Skeleton h="20px" w="68px" borderRadius="8px" />
            </HStack>
          </Table.Cell>
          <Table.Cell>
            <HStack gap={2}>
              <Skeleton h="6px" flex={1} borderRadius="full" />
              <Skeleton h="12px" w="28px" borderRadius="4px" />
            </HStack>
          </Table.Cell>
          <Table.Cell>
            <Skeleton h="13px" w="110px" borderRadius="6px" />
          </Table.Cell>
          <Table.Cell>
            <Skeleton w="24px" h="24px" borderRadius="8px" />
          </Table.Cell>
        </Table.Row>
      ))}
    </>
  )
}

function TaskRow({
  task,
  onDelete,
  index,
}: {
  task: Task
  onDelete: (id: string) => void
  index: number
}) {
  const s        = STATE[task.state] ?? { label: 'Unknown', palette: 'gray', statusPalette: 'gray' }
  const videos   = [...(task.combined_videos ?? []), ...(task.videos ?? [])]
  const progress = task.progress ?? 0

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut', delay: index * 0.045 }}
      style={{ display: 'table-row' }}
    >
      {/* Task ID */}
      <Table.Cell>
        <Text fontSize="xs" fontFamily="mono" fontWeight="600" color="text.secondary">
          {task.task_id.slice(0, 8)}…
        </Text>
      </Table.Cell>

      {/* Status – colored dot + label badge */}
      <Table.Cell>
        <HStack gap={2}>
          <Status.Root colorPalette={s.statusPalette} size="sm">
            <Status.Indicator />
          </Status.Root>
          <Badge
            colorPalette={s.palette}
            variant="subtle"
            borderRadius="badge"
            fontWeight="700"
            px={2.5}
            fontSize="xs"
          >
            {s.label}
          </Badge>
        </HStack>
      </Table.Cell>

      {/* Progress bar */}
      <Table.Cell minW="140px">
        <HStack gap={2}>
          <Progress.Root
            value={progress}
            max={100}
            flex={1}
            size="xs"
            colorPalette={
              task.state === 2 ? 'green' : task.state === 3 ? 'red' : 'blue'
            }
          >
            <Progress.Track borderRadius="full">
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
          <Text fontSize="xs" fontWeight="700" color="text.secondary" w="26px" textAlign="right">
            {progress}%
          </Text>
        </HStack>
      </Table.Cell>

      {/* Video links */}
      <Table.Cell>
        {videos.length > 0 ? (
          <Stack gap={1}>
            {videos.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-xs font-semibold hover:opacity-80 transition-opacity"
              >
                {url.split('/').at(-1)}
              </a>
            ))}
          </Stack>
        ) : (
          <Text fontSize="xs" color="text.muted">—</Text>
        )}
      </Table.Cell>

      {/* Actions */}
      <Table.Cell>
        <motion.div whileTap={{ scale: 0.86 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
          <Tooltip content="Delete task" placement="left">
            <IconButton
              aria-label="Delete task"
              size="xs"
              colorPalette="red"
              variant="ghost"
              borderRadius="nav"
              onClick={() => onDelete(task.task_id)}
            >
              <Trash2 size={14} />
            </IconButton>
          </Tooltip>
        </motion.div>
      </Table.Cell>
    </motion.tr>
  )
}

export default function TasksPage() {
  const [page, setPage] = useState(1)
  const pageSize        = 10
  const { data, isLoading, isFetching, refetch } = useTasks(page, pageSize)
  const deleteMutation  = useDeleteTask()
  const totalPages      = data ? Math.ceil(data.total / pageSize) : 1
  const hasTasks        = (data?.tasks.length ?? 0) > 0

  return (
    <PageShell maxW="6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <HStack justify="space-between" align="start">
          <Box>
            <Heading size="lg" fontWeight="800" color="text.primary">
              Tasks
            </Heading>
            <Text fontSize="sm" fontWeight="500" color="text.secondary" mt={1}>
              Auto-refreshes every 5 s. Click a video link to download.
            </Text>
          </Box>
          <HStack gap={2} pt={1}>
            {isFetching && !isLoading && (
              <Spinner size="xs" color="blue.500" />
            )}
            <motion.div
              whileTap={{ rotate: 180 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <Tooltip content="Refresh tasks">
                <IconButton
                  aria-label="Refresh tasks"
                  size="sm"
                  variant="ghost"
                  colorPalette="blue"
                  borderRadius="nav"
                  onClick={() => refetch()}
                >
                  <RefreshCw size={16} />
                </IconButton>
              </Tooltip>
            </motion.div>
          </HStack>
        </HStack>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut', delay: 0.07 }}
      >
        <Card.Root
          bg="bg.surface"
          borderColor="border.default"
          borderRadius="card"
          shadow="sm"
          overflow="hidden"
        >
          {/* Empty state */}
          {!isLoading && !hasTasks ? (
            <Card.Body py={8}>
              <EmptyState.Root>
                <EmptyState.Content>
                  <EmptyState.Indicator>
                    <ListVideo
                      size={38}
                      className="text-slate-400 dark:text-slate-500"
                    />
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
                    <Button
                      colorPalette="blue"
                      borderRadius="btn"
                      fontWeight="700"
                      size="sm"
                    >
                      Create a video
                    </Button>
                  </Link>
                </Flex>
              </EmptyState.Root>
            </Card.Body>
          ) : (
            /* Table (skeleton or real rows) */
            <Card.Body p={0}>
              <Table.Root>
                <Table.Header>
                  <Table.Row bg="bg.subtle">
                    {COLS.map((h) => (
                      <Table.ColumnHeader
                        key={h}
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
                  {isLoading ? (
                    <SkeletonRows />
                  ) : (
                    data!.tasks.map((task, i) => (
                      <TaskRow
                        key={task.task_id}
                        task={task}
                        index={i}
                        onDelete={(id) => deleteMutation.mutate(id)}
                      />
                    ))
                  )}
                </Table.Body>
              </Table.Root>
            </Card.Body>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Card.Footer
              justifyContent="flex-end"
              gap={2}
              borderTop="1px solid"
              borderColor="border.default"
              py={3}
            >
              <HStack gap={2}>
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
            </Card.Footer>
          )}
        </Card.Root>
      </motion.div>
    </PageShell>
  )
}
