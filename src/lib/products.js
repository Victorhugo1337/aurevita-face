import { request } from './api'

function slugify(value) {
  return (value || 'outros')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function mapProduct(p) {
  const activePrice = p.prices?.find((pr) => pr.active) || p.prices?.[0]

  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    category: slugify(p.category),
    categoryLabel: p.category || 'Outros',
    price: Number(activePrice?.price ?? 0),
    short: p.description || '',
    tags: p.brand ? [p.brand] : [],
    active: p.active ?? true,
    images: p.images || [],
  }
}

export async function fetchProductsPage(page = 0, size = 100) {
  return request(`/products?page=${page}&size=${size}`)
}

export async function fetchProducts() {
  const first = await fetchProductsPage(0, 100)
  let all = first.content.map(mapProduct)

  for (let p = 1; p < first.totalPages; p++) {
    const next = await fetchProductsPage(p, 100)
    all = all.concat(next.content.map(mapProduct))
  }

  return all
}

export async function fetchProductById(id) {
  const p = await request(`/products/${id}`)
  return mapProduct(p)
}

export function deriveCategories(products) {
  const map = new Map()

  for (const p of products) {
    if (!map.has(p.category)) {
      map.set(p.category, {
        slug: p.category,
        name: p.categoryLabel,
        description: '',
      })
    }
  }

  return [...map.values()]
}
