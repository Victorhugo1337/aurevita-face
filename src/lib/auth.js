import { request, setToken } from './api'

const USER_KEY = 'presence_user'

export function mapUser(data) {
  return {
    userId: data.userId,
    email: data.email,
    name: data.name,
    role: data.role,
    idSeniorDirector: data.idSeniorDirector ?? null,
    idDirector: data.idDirector ?? null,
    idDistributor: data.idDistributor ?? null,
    idRepresentant: data.idRepresentant ?? null,
    expiresIn: data.expiresIn,
  }
}

export function getSavedUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(USER_KEY)
}

export async function fetchMe() {
  const data = await request('/auth/me')
  const user = mapUser(data)
  saveUser(user)
  return user
}

export async function loginApi(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  })

  setToken(data.token)
  const user = mapUser(data)
  saveUser(user)
  return user
}

export function logoutApi() {
  setToken(null)
  saveUser(null)
}
