import { request } from './api'

export const ORDER_STATUS_LABEL = {
  PENDING: 'pendente',
  APPROVED: 'aprovado',
  SENT: 'enviado',
  DELIVERED: 'entregue',
  CANCELLED: 'cancelado',
  REJECTED: 'rejeitado',
  PENDENTE: 'pendente',
  APROVADO: 'aprovado',
  ENVIADO: 'enviado',
  ENTREGUE: 'entregue',
  CANCELADO: 'cancelado',
  REJEITADO: 'rejeitado',
}

export const ORDER_STATUS_STYLE = {
  PENDING: 'bg-clay-500/15 text-clay-600',
  PENDENTE: 'bg-clay-500/15 text-clay-600',
  APPROVED: 'bg-moss-100 text-moss-700',
  APROVADO: 'bg-moss-100 text-moss-700',
  SENT: 'bg-bone-200 text-moss-800',
  ENVIADO: 'bg-bone-200 text-moss-800',
  DELIVERED: 'bg-moss-100 text-moss-800',
  ENTREGUE: 'bg-moss-100 text-moss-800',
  CANCELLED: 'bg-bone-200 text-moss-500 line-through',
  CANCELADO: 'bg-bone-200 text-moss-500 line-through',
  REJECTED: 'bg-bone-200 text-moss-500',
  REJEITADO: 'bg-bone-200 text-moss-500',
}

export function orderStatusKey(order) {
  const raw = (order?.status || order?.statusLabel || 'PENDING').toUpperCase()
  const ptToEn = {
    PENDENTE: 'PENDING',
    APROVADO: 'APPROVED',
    ENVIADO: 'SENT',
    ENTREGUE: 'DELIVERED',
    CANCELADO: 'CANCELLED',
    REJEITADO: 'REJECTED',
  }
  return ptToEn[raw] || raw
}

export function orderStatusLabel(order) {
  const key = order?.status || order?.statusLabel
  if (!key) return '—'
  return ORDER_STATUS_LABEL[key] || ORDER_STATUS_LABEL[key.toUpperCase()] || key
}

export function orderStatusClass(order) {
  const key = order?.status || order?.statusLabel || 'PENDING'
  return ORDER_STATUS_STYLE[key] || ORDER_STATUS_STYLE[key.toUpperCase()] || 'bg-bone-200 text-moss-600'
}

export function formatOrderDate(iso) {
  if (!iso) return '—'
  return String(iso).slice(0, 10)
}

export function orderRowId(order) {
  return order.orderId ?? order.id
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

export async function fetchOrderById(id) {
  return request(`/orders/${id}`)
}

export async function createOrder(items) {
  return request('/orders', {
    method: 'POST',
    headers: { 'Idempotency-Key': crypto.randomUUID() },
    body: {
      typeApprove: 'AUTO',
      items: items.map(({ product, qty }) => ({
        idProduct: product.id,
        quantity: qty,
        idPrice: product.priceId,
      })),
    },
  })
}

export async function patchOrder(id, action) {
  return request(`/orders/${id}/${action}`, { method: 'PATCH' })
}
