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

export const getApi = <T>(path: string) =>
  request<T>(path, { method: 'GET' })
