import {
  Badge,
  Box,
  Card,
  Heading,
  HStack,
  IconButton,
  Spinner,
  Stack,
  Table,
  Text,
} from '@chakra-ui/react'
import { RefreshCw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { LoadingScreen } from '../components/ui/loading-screen'
import { PageShell } from '../components/ui/page-shell'
import { useDeleteTask, useTasks } from '../hooks/use-tasks'
import type { Task } from '../types/task'

const STATE: Record<number, { label: string; palette: string }> = {
  0: { label: 'Pending',    palette: 'gray'  },
  1: { label: 'Processing', palette: 'blue'  },
  2: { label: 'Completed',  palette: 'green' },
  3: { label: 'Failed',     palette: 'red'   },
}

function TaskRow({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) {
  const state  = STATE[task.state] ?? { label: 'Unknown', palette: 'gray' }
  const videos = [...(task.combined_videos ?? []), ...(task.videos ?? [])]

  return (
    <Table.Row _hover={{ bg: 'bg.subtle' }}>
      <Table.Cell>
        <Text fontSize="xs" fontFamily="mono" fontWeight="600" color="text.secondary">
          {task.task_id.slice(0, 8)}…
        </Text>
      </Table.Cell>
      <Table.Cell>
        <Badge colorPalette={state.palette} variant="subtle" borderRadius="badge" fontWeight="700" px={2.5}>
          {state.label}
        </Badge>
      </Table.Cell>
      <Table.Cell>
        <Text fontSize="sm" fontWeight="600" color="text.primary">
          {task.progress ?? 0}%
        </Text>
      </Table.Cell>
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
      <Table.Cell>
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
      </Table.Cell>
    </Table.Row>
  )
}

export default function TasksPage() {
  const [page, setPage]  = useState(1)
  const pageSize         = 10
  const { data, isLoading, isFetching, refetch } = useTasks(page, pageSize)
  const deleteMutation   = useDeleteTask()
  const totalPages       = data ? Math.ceil(data.total / pageSize) : 1

  return (
    <PageShell maxW="6xl">
      <HStack justify="space-between">
        <Box>
          <Heading size="lg" fontWeight="800" color="text.primary">Tasks</Heading>
          <Text fontSize="sm" fontWeight="500" color="text.secondary" mt={1}>
            Auto-refreshes every 5 s. Click a video link to download.
          </Text>
        </Box>
        <HStack gap={2}>
          {isFetching && <Spinner size="xs" color="blue.500" />}
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
        </HStack>
      </HStack>

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Card.Root
          bg="bg.surface"
          borderColor="border.default"
          borderRadius="card"
          shadow="sm"
          overflow="hidden"
        >
          <Card.Body p={0}>
            <Table.Root>
              <Table.Header>
                <Table.Row bg="bg.subtle">
                  {['Task ID', 'Status', 'Progress', 'Videos', ''].map((h) => (
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
                {!data?.tasks.length ? (
                  <Table.Row>
                    <Table.Cell colSpan={5}>
                      <Box py={12} textAlign="center">
                        <Text fontWeight="600" color="text.secondary">No tasks yet.</Text>
                        <Text fontSize="sm" color="text.muted" mt={1}>
                          Go to Create to start one.
                        </Text>
                      </Box>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  data.tasks.map((task) => (
                    <TaskRow
                      key={task.task_id}
                      task={task}
                      onDelete={(id) => deleteMutation.mutate(id)}
                    />
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Card.Body>

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
      )}
    </PageShell>
  )
}
