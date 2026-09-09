import { ROLES } from './roles'

/** CRUD de produtos — contrato API: POST/PUT/DELETE /products (ADMIN) */
export function canManageProducts(role) {
  return role === ROLES.ADMIN
}

/** Rotas /app permitidas por role */
export const APP_ACCESS = {
  dashboard: [ROLES.SENIOR, ROLES.DIRECTOR, ROLES.DISTRIBUTOR],
  orders: [ROLES.SENIOR, ROLES.DIRECTOR, ROLES.DISTRIBUTOR, ROLES.REPRESENTANT],
  catalog: [ROLES.SENIOR, ROLES.DIRECTOR, ROLES.DISTRIBUTOR, ROLES.REPRESENTANT],
  cart: [ROLES.SENIOR, ROLES.DIRECTOR, ROLES.DISTRIBUTOR, ROLES.REPRESENTANT],
  movements: [ROLES.SENIOR, ROLES.DIRECTOR, ROLES.DISTRIBUTOR, ROLES.REPRESENTANT],
  config: [ROLES.SENIOR],
}

const PATH_FEATURE = {
  '/app': 'dashboard',
  '/app/pedidos': 'orders',
  '/app/catalogo': 'catalog',
  '/app/carrinho': 'cart',
  '/app/movimentacoes': 'movements',
  '/app/config': 'config',
}

export function canAccessApp(role, path) {
  const feature = PATH_FEATURE[path]
  if (!feature) return true
  return APP_ACCESS[feature]?.includes(role) ?? false
}

export function getAppHomeRoute(role) {
  if (APP_ACCESS.dashboard.includes(role)) return '/app'
  if (APP_ACCESS.orders.includes(role)) return '/app/pedidos'
  return '/app/catalogo'
}

export function getAppNavItems(role) {
  const items = []
  if (APP_ACCESS.dashboard.includes(role)) {
    items.push({ to: '/app', icon: 'dashboard', label: 'Dashboard', end: true })
  }
  if (APP_ACCESS.orders.includes(role)) {
    items.push({ to: '/app/pedidos', icon: 'orders', label: 'Pedidos' })
  }
  if (APP_ACCESS.catalog.includes(role)) {
    items.push({ to: '/app/catalogo', icon: 'catalog', label: 'Catálogo' })
  }
  if (APP_ACCESS.movements.includes(role)) {
    items.push({ to: '/app/movimentacoes', icon: 'movements', label: 'Movimentações' })
  }
  if (APP_ACCESS.config.includes(role)) {
    items.push({ to: '/app/config', icon: 'config', label: 'Configurações' })
  }
  return items
}
