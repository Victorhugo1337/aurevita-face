import { request } from './api'
import { fetchAllOrders } from './orders'

/**
 * Tenta GET /dashboard/summary (escopo no back-end).
 * Enquanto o endpoint não existir, calcula KPIs a partir de /orders/search.
 */
export async function fetchDashboardSummary() {
  try {
    return await request('/dashboard/summary')
  } catch (e) {
    if (e.status !== 404) throw e
    return buildFallbackFromOrders()
  }
}

async function buildFallbackFromOrders() {
  const orders = await fetchAllOrders()

  const active = orders.filter((o) => o.status !== 'CANCELLED' && o.status !== 'REJECTED')
  const revenue = active.reduce((s, o) => s + Number(o.total), 0)

  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'PENDING').length,
    approvedOrders: orders.filter((o) => o.status === 'APPROVED').length,
    sentOrders: orders.filter((o) => o.status === 'SENT').length,
    deliveredOrders: orders.filter((o) => o.status === 'DELIVERED').length,
    revenue,
    topProducts: [],
    recentOrders: orders.slice(0, 5),
  }
}
