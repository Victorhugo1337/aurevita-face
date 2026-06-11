import { request } from './api'
import { resolveProductPricing } from './pricing'

export function mapProduct(p, user) {
  const pricing = resolveProductPricing(p, user)

  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    category: p.category || '',
    categoryLabel: p.category || 'Outros',
    price: pricing.price,
    priceId: pricing.priceId,
    priceSource: pricing.priceSource,
    standardPrice: pricing.standardPrice,
    priceTier: pricing.priceLevel,
    priceLevelLabel: pricing.priceLevelLabel,
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
  const { user, ...rest } = filters
  return request(`/products?${buildQuery(rest)}`)
}

export async function fetchProducts(filters = {}) {
  const { user, ...rest } = filters
  const first = await fetchProductsPage(rest)
  let all = first.content.map((p) => mapProduct(p, user))

  for (let p = 1; p < first.totalPages; p++) {
    const next = await fetchProductsPage({ ...rest, page: p, size: 100 })
    all = all.concat(next.content.map((item) => mapProduct(item, user)))
  }

  return all
}

export async function fetchProductById(id, user) {
  const p = await request(`/products/${id}`)
  return mapProduct(p, user)
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
