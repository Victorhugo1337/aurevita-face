import { request } from './api'
import { ROLES } from './roles'

const PRICE_TYPE_BY_ROLE = {
  [ROLES.REPRESENTANT]: 'REPRESENTANT',
  [ROLES.DISTRIBUTOR]: 'DISTRIBUTOR',
  [ROLES.DIRECTOR]: 'DIRECTOR',
  [ROLES.SENIOR]: 'SENIOR',
  [ROLES.ADMIN]: 'REPRESENTANT',
}

function resolvePriceId(p, priceLevel) {
  const tier = p.prices?.find((pr) => pr.type?.toUpperCase() === priceLevel?.toUpperCase())
  if (tier) return tier.id
  return p.prices?.[0]?.id ?? null
}

function pickPriceForRole(p, role) {
  const type = PRICE_TYPE_BY_ROLE[role] || 'REPRESENTANT'
  const tier = p.prices?.find((pr) => pr.type?.toUpperCase() === type)
  if (tier) return { price: Number(tier.price), priceLevel: type, priceId: tier.id }

  const fallback = p.prices?.[0]
  if (fallback) {
    return { price: Number(fallback.price), priceLevel: fallback.type, priceId: fallback.id }
  }

  return { price: Number(p.price ?? 0), priceLevel: type, priceId: null }
}

export function mapProduct(p, role) {
  const fromApi = p.price != null && p.priceLevel
  const resolved = fromApi
    ? {
        price: Number(p.price),
        priceLevel: p.priceLevel,
        priceLevelLabel: p.priceLevelLabel,
        priceId: resolvePriceId(p, p.priceLevel),
      }
    : (() => {
        const fallback = pickPriceForRole(p, role)
        return { ...fallback, priceLevelLabel: null }
      })()

  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    category: p.category || '',
    categoryLabel: p.category || 'Outros',
    price: resolved.price,
    priceId: resolved.priceId,
    priceTier: resolved.priceLevel,
    priceLevelLabel: resolved.priceLevelLabel,
    short: p.description || '',
    description: p.description || '',
    brand: p.brand || '',
    unit: p.unit || '',
    tags: p.brand ? [p.brand] : [],
    active: p.active ?? true,
    images: p.images || [],
    prices: p.prices || [],
  }
}

function buildQuery({ page = 0, size = 20, category, search, active } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  if (category) params.set('category', category)
  if (search) params.set('search', search)
  if (active != null) params.set('active', String(active))
  return params.toString()
}

export async function fetchProductsPage(filters = {}) {
  const { role, ...rest } = filters
  return request(`/products?${buildQuery(rest)}`)
}

export async function fetchProducts(filters = {}) {
  const { role, ...rest } = filters
  const first = await fetchProductsPage(rest)
  let all = first.content.map((p) => mapProduct(p, role))

  for (let p = 1; p < first.totalPages; p++) {
    const next = await fetchProductsPage({ ...rest, page: p, size: 100 })
    all = all.concat(next.content.map((item) => mapProduct(item, role)))
  }

  return all
}

export async function fetchProductById(id, role) {
  const p = await request(`/products/${id}`)
  return mapProduct(p, role)
}

export async function fetchCategories() {
  const map = await request('/products/categories')
  return Object.entries(map).map(([slug, name]) => ({ slug, name }))
}

export async function createProduct(body) {
  const p = await request('/products', { method: 'POST', body })
  return mapProduct(p)
}

export async function updateProduct(id, body) {
  const p = await request(`/products/${id}`, { method: 'PUT', body })
  return mapProduct(p)
}

export async function deleteProduct(id) {
  return request(`/products/${id}`, { method: 'DELETE' })
}

/** @deprecated use fetchCategories */
export function deriveCategories(products) {
  const map = new Map()
  for (const p of products) {
    if (p.category && !map.has(p.category)) {
      map.set(p.category, { slug: p.category, name: p.categoryLabel || p.category })
    }
  }
  return [...map.values()]
}
