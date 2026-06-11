import { useEffect, useState } from 'react'
import { fetchAllMovements, formatMovementProduct, formatMovementNote } from '../../lib/movements'
import { formatOrderDate } from '../../lib/orders'
import { useStore } from '../../lib/store'
import { ROLES } from '../../lib/roles'

const MOVEMENTS_SUBTITLE = {
  [ROLES.REPRESENTANT]: 'Apenas suas movimentações de estoque e pedidos.',
  [ROLES.DISTRIBUTOR]: 'Movimentações dos representantes da sua filial.',
  [ROLES.DIRECTOR]: 'Movimentações de todas as filiais da diretoria.',
  [ROLES.SENIOR]: 'Movimentações consolidadas de toda a empresa.',
}

export function MovementsPage({ title = 'Movimentações', subtitle }) {
  const { user } = useStore()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAllMovements()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <div className="mb-8 lg:mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-moss-600 mb-2">Operação</p>
        <h1 className="page-title">{title}</h1>
        <p className="text-moss-600 text-sm mt-2">
          {subtitle || MOVEMENTS_SUBTITLE[user?.role] || 'Histórico no seu escopo.'}
        </p>
      </div>

      {loading && <p className="text-moss-600 text-sm">Carregando…</p>}
      {error && <p className="text-clay-600 text-sm">{error}</p>}

      <div className="card overflow-hidden">
        <div className="table-wrap">
        <table className="w-full text-sm">
          <thead className="bg-bone-100 border-b border-bone-200">
            <tr className="text-left text-xs uppercase tracking-widest text-moss-600">
              <th className="py-3 px-5">ID</th>
              <th className="py-3 px-5">Tipo</th>
              <th className="py-3 px-5">Produto</th>
              <th className="py-3 px-5 text-right">Qtd</th>
              <th className="py-3 px-5">Data</th>
              <th className="py-3 px-5">Obs.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bone-200">
            {items.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-moss-600">Nenhuma movimentação.</td>
              </tr>
            )}
            {items.map((m) => (
              <tr key={m.id} className="hover:bg-bone-100/50">
                <td className="py-3 px-5 font-mono text-moss-700">#{m.id}</td>
                <td className="py-3 px-5">
                  <span className="badge bg-moss-100 text-moss-700">{m.type}</span>
                </td>
                <td className="py-3 px-5">{formatMovementProduct(m)}</td>
                <td className="py-3 px-5 text-right">{m.quantity}</td>
                <td className="py-3 px-5 font-mono text-xs text-moss-600">{formatOrderDate(m.createdAt)}</td>
                <td className="py-3 px-5 text-moss-600 truncate max-w-[200px]">{formatMovementNote(m)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}

export function AppMovements() {
  return (
    <MovementsPage
      title="Minhas movimentações"
      subtitle="Histórico de estoque e pedidos no seu escopo."
    />
  )
}

export function AdminMovements() {
  return (
    <MovementsPage
      title="Movimentações gerais"
      subtitle="Visão global de entradas, saídas e ajustes de estoque."
    />
  )
}
