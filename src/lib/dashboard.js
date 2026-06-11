import { request } from './api'

export async function fetchDashboardSummary() {
  return request('/dashboard/summary')
}
