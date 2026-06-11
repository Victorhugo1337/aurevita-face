import { request } from './api'

export async function fetchNetworkSummary() {
  return request('/admin/network-summary')
}

export async function fetchClients({ page = 0, size = 50 } = {}) {
  const q = new URLSearchParams({ page: String(page), size: String(size) })
  return request(`/admin/clients?${q}`)
}

export async function createClient(body) {
  return request('/admin/clients', { method: 'POST', body })
}

export async function createAdmin(body) {
  return request('/admin/admins', { method: 'POST', body })
}
