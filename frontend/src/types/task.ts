export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type Task = {
  task_id: string
  state: number
  progress: number
  videos?: string[]
  combined_videos?: string[]
}

export type TaskListData = {
  tasks: Task[]
  total: number
  page: number
  page_size: number
}
