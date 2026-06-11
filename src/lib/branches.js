import { request } from './api'

export async function fetchBranches() {
  const data = await request('/branches?page=0&size=100')
  return data.content
}
