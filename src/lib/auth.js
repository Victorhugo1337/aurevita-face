import { request, setToken } from './api'

const USER_KEY = 'presence_user'

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

export async function loginApi(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  })

  setToken(data.token)
  const user = {
    userId: data.userId,
    email: data.email,
    name: data.name,
    role: data.role,
    expiresIn: data.expiresIn,
  }
  saveUser(user)
  return user
}

export function logoutApi() {
  setToken(null)
  saveUser(null)
}
