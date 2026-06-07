import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteApi, getApi } from '../lib/api'
import { isTaskActive } from '../lib/task-status'
import type { ApiResponse } from '../types/api'
import type { Task, TaskListData } from '../types/task'

export const TASKS_KEY = ['tasks'] as const

export function useTasks(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: [...TASKS_KEY, page, pageSize],
    queryFn: () =>
      getApi<ApiResponse<TaskListData>>(
        `/api/v1/tasks?page=${page}&page_size=${pageSize}`,
      ),
    select: (res) => res.data,
    refetchInterval: 5000,
  })
}

export function useTask(taskId: string) {
  return useQuery({
    queryKey: [...TASKS_KEY, taskId],
    queryFn: () => getApi<ApiResponse<Task>>(`/api/v1/tasks/${taskId}`),
    select: (res) => res.data,
    enabled: Boolean(taskId),
    refetchInterval: (query) => {
      const task = query.state.data?.data
      if (!task) return 2000
      return isTaskActive(task.state) ? 1500 : false
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (taskId: string) =>
      deleteApi(`/api/v1/tasks/${taskId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
    },
  })
}
