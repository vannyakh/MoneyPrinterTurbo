import type { Task } from '../types/task'

export function getTaskVideos(task: Task) {
  return [...(task.combined_videos ?? []), ...(task.videos ?? [])]
}

/** Prefer final rendered output (final-*.mp4) over intermediate combined clips */
export function getTaskFinalVideo(task: Task): string | null {
  const finals = task.videos ?? []
  if (finals.length > 0) return finals[finals.length - 1]
  const combined = task.combined_videos ?? []
  if (combined.length > 0) return combined[combined.length - 1]
  return null
}

export function getTaskTerms(task: Task): string[] {
  if (!task.terms) return []
  if (Array.isArray(task.terms)) return task.terms.filter(Boolean)
  return task.terms
    .split(/[,，]/)
    .map((t) => t.trim())
    .filter(Boolean)
}

export function getTaskMaterials(task: Task): string[] {
  if (!task.materials?.length) return []
  return task.materials.map((item) => {
    if (typeof item === 'string') return item.split('/').pop() ?? item
    return item.url?.split('/').pop() ?? item.provider ?? 'material'
  })
}

export function getTaskPrimaryVideo(task: Task) {
  return getTaskFinalVideo(task)
}

/** Index of the final output inside getTaskVideos — use for preview when render is done */
export function getTaskPreviewVideoIndex(task: Task): number {
  const all = getTaskVideos(task)
  const final = getTaskFinalVideo(task)
  if (!final || all.length === 0) return 0
  const idx = all.indexOf(final)
  return idx >= 0 ? idx : 0
}

export function formatTaskId(taskId: string, length = 8) {
  return taskId.length > length ? `${taskId.slice(0, length)}…` : taskId
}
