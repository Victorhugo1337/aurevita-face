export const ROLES = {
  ADMIN: 'ADMIN',
  SENIOR: 'SENIOR',
  DIRECTOR: 'DIRECTOR',
  DISTRIBUTOR: 'DISTRIBUTOR',
  REPRESENTANT: 'REPRESENTANT',
}

/** Parceiros B2B — painel /app (não equipe interna Aurevita) */
export const APP_ROLES = [
  ROLES.SENIOR,
  ROLES.DIRECTOR,
  ROLES.DISTRIBUTOR,
  ROLES.REPRESENTANT,
]

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrador Aurevita',
  [ROLES.SENIOR]: 'Diretor Sênior',
  [ROLES.DIRECTOR]: 'Diretor',
  [ROLES.DISTRIBUTOR]: 'Distribuidor',
  [ROLES.REPRESENTANT]: 'Representante',
}

export function isAdmin(role) {
  return role === ROLES.ADMIN
}

export function isAppUser(role) {
  return APP_ROLES.includes(role)
}

export function getHomeRoute(role) {
  if (isAdmin(role)) return '/admin'
  if (role === ROLES.REPRESENTANT) return '/app/pedidos'
  if (isAppUser(role)) return '/app'
  return '/'
}

export function getRoleLabel(role) {
  return ROLE_LABELS[role] || role
}
