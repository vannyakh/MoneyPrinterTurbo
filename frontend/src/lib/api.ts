import { API_BASE_URL } from '../constants/app'

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init.headers },
    ...init,
  })
  const payload = await response.json()
  if (!response.ok || payload?.status >= 400) {
    const message = payload?.message || `Request failed: ${response.status}`
    throw new Error(message)
  }
  return payload as T
}

export const postApi = <T>(path: string, body: Record<string, unknown>) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) })

export const putApi = <T>(path: string, body: Record<string, unknown>) =>
  request<T>(path, { method: 'PUT', body: JSON.stringify(body) })

export const deleteApi = <T>(path: string) =>
  request<T>(path, { method: 'DELETE' })

export const getApi = <T>(path: string, params?: Record<string, string | number | undefined>) => {
  const query = params
    ? `?${new URLSearchParams(
        Object.entries(params)
          .filter(([, value]) => value !== undefined && value !== '')
          .map(([key, value]) => [key, String(value)]),
      ).toString()}`
    : ''
  return request<T>(`${path}${query}`)
}

export async function postBlob(
  path: string,
  body: Record<string, unknown>,
): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    let message = `Request failed: ${response.status}`
    try {
      const payload = await response.json()
      message = payload?.message || message
    } catch {
      // binary error body
    }
    throw new Error(message)
  }

  return response.blob()
}

export async function uploadFormData<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    body: formData,
  })
  const payload = await response.json()
  if (!response.ok || payload?.status >= 400) {
    const message = payload?.message || `Request failed: ${response.status}`
    throw new Error(message)
  }
  return payload as T
}
