import type { Task } from '../types/task'

/** Matches app/models/const.py */
export const TASK_STATE = {
  FAILED: -1,
  COMPLETE: 1,
  PROCESSING: 4,
} as const

export const TASK_STATE_META: Record<
  number,
  { label: string; palette: string; statusPalette: string }
> = {
  [TASK_STATE.PROCESSING]: { label: 'Processing', palette: 'blue',  statusPalette: 'blue'  },
  [TASK_STATE.COMPLETE]:   { label: 'Completed',  palette: 'green', statusPalette: 'green' },
  [TASK_STATE.FAILED]:     { label: 'Failed',     palette: 'red',   statusPalette: 'red'   },
}

export const RENDER_PIPELINE = [
  { id: 'queued',        title: 'Queued',        sub: 'waiting to start',      stage: 'queued'        },
  { id: 'initializing',  title: 'Initializing',  sub: 'preparing pipeline',    stage: 'initializing'  },
  { id: 'script',        title: 'Script',        sub: 'generating script',     stage: 'script'        },
  { id: 'audio',         title: 'Voice',         sub: 'synthesizing audio',    stage: 'audio'         },
  { id: 'subtitles',     title: 'Subtitles',     sub: 'building subtitles',    stage: 'subtitles'     },
  { id: 'materials',     title: 'Materials',     sub: 'fetching video clips',  stage: 'materials'     },
  { id: 'compositing',   title: 'Compositing',   sub: 'combining clips',       stage: 'compositing'   },
  { id: 'encoding',      title: 'Finalizing',    sub: 'encoding output',       stage: 'encoding'      },
] as const

const STAGE_BY_ID = Object.fromEntries(
  RENDER_PIPELINE.map((s, i) => [s.id, { ...s, index: i }]),
) as Record<string, (typeof RENDER_PIPELINE)[number] & { index: number }>

const PROGRESS_FALLBACK: { min: number; id: string }[] = [
  { min: 0,  id: 'queued'       },
  { min: 5,  id: 'initializing' },
  { min: 10, id: 'script'       },
  { min: 20, id: 'audio'        },
  { min: 30, id: 'subtitles'    },
  { min: 40, id: 'materials'    },
  { min: 50, id: 'compositing'  },
  { min: 75, id: 'encoding'     },
]

export function getTaskStateMeta(state: number) {
  return TASK_STATE_META[state] ?? { label: 'Unknown', palette: 'gray', statusPalette: 'gray' }
}

export function isTaskActive(state: number | undefined) {
  return state === TASK_STATE.PROCESSING
}

export function isTaskDone(state: number | undefined) {
  return state === TASK_STATE.COMPLETE
}

export function isTaskFailed(state: number | undefined) {
  return state === TASK_STATE.FAILED
}

export function getRenderStatus(task: Pick<Task, 'progress' | 'stage' | 'state'> | undefined) {
  if (!task) {
    return { ...RENDER_PIPELINE[0], index: 0, total: RENDER_PIPELINE.length }
  }

  if (isTaskFailed(task.state)) {
    return {
      title: 'Failed',
      sub: 'render stopped',
      stage: 'failed',
      index: RENDER_PIPELINE.length - 1,
      total: RENDER_PIPELINE.length,
    }
  }

  const stageId =
    task.stage ??
    [...PROGRESS_FALLBACK].reverse().find((s) => (task.progress ?? 0) >= s.min)?.id ??
    'queued'

  const meta = STAGE_BY_ID[stageId] ?? STAGE_BY_ID.queued
  return { ...meta, total: RENDER_PIPELINE.length }
}

export function parseVideoAspect(aspect: string) {
  const [w, h] = aspect.split(':').map(Number)
  if (!w || !h) return { ratioW: 16, ratioH: 9 }
  return { ratioW: w, ratioH: h }
}

export function fitAspectBox(
  containerW: number,
  containerH: number,
  ratioW: number,
  ratioH: number,
) {
  if (containerW <= 0 || containerH <= 0) return { width: 0, height: 0 }
  const aspect = ratioW / ratioH
  const boxAspect = containerW / containerH
  if (boxAspect > aspect) {
    const height = containerH
    return { width: Math.round(height * aspect), height }
  }
  const width = containerW
  return { width, height: Math.round(width / aspect) }
}
