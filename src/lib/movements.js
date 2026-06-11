import { request } from './api'

export async function fetchMovements(page = 0, size = 50) {
  const data = await request(`/movements?page=${page}&size=${size}`)
  return data.content
}

export async function fetchAllMovements() {
  const first = await request('/movements?page=0&size=100')
  let all = first.content
  for (let p = 1; p < first.totalPages; p++) {
    const next = await request(`/movements?page=${p}&size=100`)
    all = all.concat(next.content)
  }
  return all
}

/** Rótulo do produto em movimentações — API envia productName enriquecido. */
export function formatMovementProduct(m) {
  if (m?.productName) return m.productName
  if (m?.idProduct != null) return `Produto #${m.idProduct}`
  return '—'
}

export function formatMovementNote(m) {
  return m?.description || m?.observation || '—'
}
