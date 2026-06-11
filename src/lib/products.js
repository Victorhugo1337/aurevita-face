import { request, uploadFile } from './api'
import { resolveProductPricing } from './pricing'

export const PRODUCT_PRICE_TYPES = [
  { value: 'REPRESENTANT', label: 'Representante' },
  { value: 'DISTRIBUTOR', label: 'Distribuidor' },
  { value: 'DIRECTOR', label: 'Diretor' },
  { value: 'SENIOR', label: 'Diretor sênior' },
]

export function buildProductBody(form) {
  const body = {
    name: form.name?.trim(),
    description: form.description?.trim() || undefined,
    sku: form.sku?.trim() || undefined,
    brand: form.brand?.trim() || undefined,
    category: form.category || undefined,
    unit: form.unit?.trim() || undefined,
  }
  return Object.fromEntries(Object.entries(body).filter(([, v]) => v != null && v !== ''))
}

export function resolveCategorySlug(category, categories = []) {
  if (!category) return ''
  if (categories.some((c) => c.slug === category)) return category
  return categories.find((c) => c.name === category)?.slug || category
}

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
  const p = await request('/products', { method: 'POST', body: buildProductBody(body) })
  return mapProduct(p)
}

export async function updateProduct(id, body) {
  const p = await request(`/products/${id}`, { method: 'PUT', body: buildProductBody(body) })
  return mapProduct(p)
}

export async function deleteProduct(id) {
  return request(`/products/${id}`, { method: 'DELETE' })
}

export async function addProductPrice(productId, { price, type }) {
  return request(`/products/${productId}/prices`, {
    method: 'POST',
    body: { price: Number(price), type: type || undefined },
  })
}

export async function deleteProductPrice(priceId) {
  return request(`/products/prices/${priceId}`, { method: 'DELETE' })
}

export async function uploadProductImage(productId, file) {
  return uploadFile(`/products/${productId}/images`, file)
}

export async function deleteProductImage(imageId) {
  return request(`/products/images/${imageId}`, { method: 'DELETE' })
}

/** Cria ou atualiza produto e, se informado, adiciona preço e imagem (endpoints separados da API). */
export async function saveProduct({ id, form, price, priceType, imageFile }) {
  const product = id ? await updateProduct(id, form) : await createProduct(form)

  if (price != null && Number(price) > 0) {
    await addProductPrice(product.id, { price, type: priceType })
  }
  if (imageFile) {
    await uploadProductImage(product.id, imageFile)
  }

  return product
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
