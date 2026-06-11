const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const TOKEN_KEY = 'presence_token'

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function request(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  const h = { 'Content-Type': 'application/json', ...headers }

  if (auth) {
    const token = getToken()
    if (token) h.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: h,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null

  let json
  try {
    json = await res.json()
  } catch {
    throw new ApiError('Resposta inválida da API', res.status)
  }

  if (!json.success) {
    const msg = json.message || json.errors?.join(', ') || 'Erro na requisição'
    throw new ApiError(msg, res.status, json)
  }

  return json.data
}
