import { request } from './api'

function paged(path, { page = 0, size = 50 } = {}) {
  const q = new URLSearchParams({ page: String(page), size: String(size) })
  return request(`${path}?${q}`)
}

export async function fetchUsers(params) {
  return paged('/users', params)
}

export async function fetchDirectors(params) {
  return paged('/directors', params)
}

export async function fetchSeniorDirectors(params) {
  return paged('/senior-directors', params)
}

export async function fetchDistributors(params) {
  return paged('/distributors', params)
}

export async function fetchRepresentants(params) {
  return paged('/representants', params)
}

export async function createUser(body) {
  return request('/users', { method: 'POST', body })
}

export async function createDirector(body) {
  return request('/directors', { method: 'POST', body })
}

export async function createRepresentant(body) {
  return request('/representants', { method: 'POST', body })
}

export async function createDistributor(body) {
  return request('/distributors', { method: 'POST', body })
}

/** Lista unificada quando GET /users não está disponível (fallback). */
export async function fetchTeamMembers() {
  const [directors, distributors, representants] = await Promise.all([
    fetchDirectors({ size: 200 }),
    fetchDistributors({ size: 200 }),
    fetchRepresentants({ size: 200 }),
  ])

  const rows = [
    ...(directors.content || []).map((d) => ({
      id: d.idUser || d.id,
      entityId: d.id,
      name: d.name,
      email: d.email,
      type: 'DIRECTOR',
    })),
    ...(distributors.content || []).map((d) => ({
      id: d.idUser || d.id,
      entityId: d.id,
      name: d.name,
      email: d.email,
      type: 'DISTRIBUTOR',
    })),
    ...(representants.content || []).map((r) => ({
      id: r.idUser || r.id,
      entityId: r.id,
      name: r.name,
      email: r.email,
      type: 'REPRESENTANT',
    })),
  ]

  return { content: rows, totalElements: rows.length }
}

export async function fetchTeamForSenior(idSeniorDirector) {
  try {
    const users = await fetchUsers({ size: 200 })
    const scoped = (users.content || []).filter(
      (u) => u.type !== 'ADMIN' && u.idSeniorDirector === idSeniorDirector
    )
    if (scoped.length > 0) return { content: scoped, totalElements: scoped.length }
  } catch {
    /* GET /users pode retornar 403 até o back liberar SENIOR */
  }

  const [directors, distributors, representants] = await Promise.all([
    fetchDirectors({ size: 200 }),
    fetchDistributors({ size: 200 }),
    fetchRepresentants({ size: 200 }),
  ])

  const directorIds = new Set(
    (directors.content || [])
      .filter((d) => d.idSeniorDirector === idSeniorDirector)
      .map((d) => d.id)
  )

  const rows = [
    ...(directors.content || [])
      .filter((d) => d.idSeniorDirector === idSeniorDirector)
      .map((d) => ({ id: d.idUser, name: d.name, email: d.email, type: 'DIRECTOR' })),
    ...(distributors.content || [])
      .filter((d) => directorIds.has(d.idDirector))
      .map((d) => ({ id: d.idUser, name: d.name, email: d.email, type: 'DISTRIBUTOR' })),
    ...(representants.content || [])
      .filter((r) => {
        const dist = (distributors.content || []).find((d) => d.id === r.idDistributor)
        return dist && directorIds.has(dist.idDirector)
      })
      .map((r) => ({ id: r.idUser, name: r.name, email: r.email, type: 'REPRESENTANT' })),
  ]

  return { content: rows, totalElements: rows.length }
}
