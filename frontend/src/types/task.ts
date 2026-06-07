export type Task = {
  task_id: string
  state: number
  progress: number
  stage?: string
  videos?: string[]
  combined_videos?: string[]
  script?: string
  terms?: string | string[]
  materials?: Array<string | { url?: string; provider?: string; duration?: number }>
}

export type TaskViewMode = 'grid' | 'list'

export type TaskListData = {
  tasks: Task[]
  total: number
  page: number
  page_size: number
}
