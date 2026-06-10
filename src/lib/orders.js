import { request } from './api'

export const ORDER_STATUS_LABEL = {
  PENDING: 'pendente',
  APPROVED: 'aprovado',
  SENT: 'enviado',
  DELIVERED: 'entregue',
  CANCELLED: 'cancelado',
  REJECTED: 'rejeitado',
}

export const ORDER_STATUS_STYLE = {
  PENDING: 'bg-clay-500/15 text-clay-600',
  APPROVED: 'bg-moss-100 text-moss-700',
  SENT: 'bg-bone-200 text-moss-800',
  DELIVERED: 'bg-moss-100 text-moss-800',
  CANCELLED: 'bg-bone-200 text-moss-500 line-through',
  REJECTED: 'bg-bone-200 text-moss-500',
}

export function formatOrderDate(iso) {
  if (!iso) return '—'
  return iso.slice(0, 10)
}

export async function searchOrders(filter = {}) {
  const data = await request('/orders/search', {
    method: 'POST',
    body: { page: 0, size: 100, ...filter },
  })
  return data.content
}

export async function fetchAllOrders() {
  const first = await request('/orders/search', {
    method: 'POST',
    body: { page: 0, size: 100 },
  })

  let all = first.content
  for (let p = 1; p < first.totalPages; p++) {
    const next = await request('/orders/search', {
      method: 'POST',
      body: { page: p, size: 100 },
    })
    all = all.concat(next.content)
  }

  return all
}
