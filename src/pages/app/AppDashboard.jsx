import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, ShoppingCart, Clock, Truck, ArrowUpRight, ArrowLeftRight } from 'lucide-react'
import { fetchDashboardSummary } from '../../lib/dashboard'
import { formatBRL } from '../../lib/format'
import { formatMovementProduct } from '../../lib/movements'
import { orderStatusLabel, orderStatusClass, formatOrderDate, orderRowId } from '../../lib/orders'
import { useStore } from '../../lib/store'
import { ROLES, getRoleLabel } from '../../lib/roles'

const DASHBOARD_COPY = {
  [ROLES.SENIOR]: 'Visão consolidada de toda a empresa e filiais.',
  [ROLES.DIRECTOR]: 'Acompanhe todas as filiais da sua diretoria.',
  [ROLES.DISTRIBUTOR]: 'Pedidos e movimentação dos representantes da sua filial.',
}

export function AppDashboard() {
  const { user } = useStore()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardSummary()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const kpis = data ? [
    { label: 'Receita', value: formatBRL(data.revenue), diff: 'sua operação', icon: TrendingUp },
    { label: 'Pedidos', value: data.totalOrders, diff: `${data.pendingOrders} pendentes`, icon: ShoppingCart },
    { label: 'Aprovados', value: data.approvedOrders, diff: 'aguardando envio', icon: Clock },
    { label: 'Enviados', value: data.sentOrders, diff: `${data.deliveredOrders} entregues`, icon: Truck },
  ] : []

  return (
    <div className="page">
      <div className="mb-8 lg:mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-moss-600 mb-2">Portal do parceiro</p>
        <h1 className="page-title">
          Olá, {user?.name?.split(' ')[0]}.
        </h1>
        <p className="text-moss-600 text-sm mt-2">
          {getRoleLabel(user?.role)} — {DASHBOARD_COPY[user?.role] || 'Visão da sua operação.'}
        </p>
      </div>

      {loading && <p className="text-moss-600 text-sm">Carregando resumo…</p>}
      {error && <p className="text-clay-600 text-sm">{error}</p>}

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map(({ label, value, diff, icon: Icon }) => (
              <div key={label} className="card p-6">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xs uppercase tracking-widest text-moss-600">{label}</span>
                  <Icon size={16} className="text-moss-400" />
                </div>
                <div className="font-display text-3xl text-moss-950">{value}</div>
                <div className="text-xs text-moss-600 mt-2 flex items-center gap-1">
                  <ArrowUpRight size={12} /> {diff}
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-xl text-moss-950">Pedidos recentes</h2>
                <Link to="/app/pedidos" className="text-sm text-moss-700 hover:text-moss-900">
                  ver todos →
                </Link>
              </div>
              {data.recentOrders?.length === 0 ? (
                <p className="text-sm text-moss-600">Nenhum pedido registrado ainda.</p>
              ) : (
                <div className="divide-y divide-bone-200">
                  {data.recentOrders.map((o) => (
                    <div key={orderRowId(o)} className="flex items-center justify-between py-3 text-sm">
                      <div>
                        <span className="font-mono text-moss-700">#{orderRowId(o)}</span>
                        <span className="text-moss-500 mx-2">·</span>
                        <span className="text-moss-600">{formatOrderDate(o.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{formatBRL(o.total)}</span>
                        <span className={`badge ${orderStatusClass(o)}`}>
                          {orderStatusLabel(o)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-xl text-moss-950 flex items-center gap-2">
                  <ArrowLeftRight size={18} className="text-moss-600" />
                  Movimentações recentes
                </h2>
                <Link to="/app/movimentacoes" className="text-sm text-moss-700 hover:text-moss-900">
                  ver todas →
                </Link>
              </div>
              {!data.recentMovements?.length ? (
                <p className="text-sm text-moss-600">Nenhuma movimentação no seu escopo.</p>
              ) : (
                <div className="divide-y divide-bone-200">
                  {data.recentMovements.map((m) => (
                    <div key={m.id} className="flex justify-between py-3 text-sm">
                      <div>
                        <span className="badge bg-moss-100 text-moss-700 mr-2">{m.type}</span>
                        <span className="text-moss-600">{formatMovementProduct(m)}</span>
                      </div>
                      <span className="text-xs text-moss-500">{formatOrderDate(m.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
