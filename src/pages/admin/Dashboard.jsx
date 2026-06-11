import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, ShoppingCart, Users, Package, ArrowUpRight, ArrowLeftRight } from 'lucide-react'
import { fetchDashboardSummary } from '../../lib/dashboard'
import { formatBRL } from '../../lib/format'
import { formatMovementProduct } from '../../lib/movements'
import { orderStatusLabel, orderStatusClass, formatOrderDate, orderRowId } from '../../lib/orders'

export function Dashboard() {
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
    { label: 'Receita', value: formatBRL(data.revenue), diff: `${data.totalOrders} pedidos`, icon: TrendingUp },
    { label: 'Pedidos', value: data.totalOrders, diff: `${data.pendingOrders} pendentes`, icon: ShoppingCart },
    { label: 'Clientes', value: data.totalClients, diff: 'rede B2B', icon: Users },
    { label: 'Aprovados', value: data.approvedOrders, diff: `${data.sentOrders} enviados`, icon: Package },
  ] : []

  const movements = data?.recentMovements || []

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-moss-600 mb-2">Visão geral</p>
          <h1 className="page-title">Dashboard Aurevita</h1>
        </div>
      </div>

      {loading && <p className="text-moss-600 text-sm mb-6">Carregando dados…</p>}
      {error && <p className="text-clay-600 text-sm mb-6">{error}</p>}

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

          <div className="grid lg:grid-cols-2 gap-4 mb-4">
            <div className="card p-6">
              <h2 className="font-display text-xl text-moss-950 mb-6">Produtos mais vendidos</h2>
              {data.topProducts?.length === 0 ? (
                <p className="text-sm text-moss-600">Sem dados ainda.</p>
              ) : (
                <ul className="space-y-3">
                  {data.topProducts?.map((p) => (
                    <li key={p.productId} className="flex justify-between text-sm">
                      <span className="text-moss-950">{p.name}</span>
                      <span className="text-moss-600">{p.quantitySold} un · {formatBRL(p.revenue)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-xl text-moss-950">Pedidos recentes</h2>
                <Link to="/admin/pedidos" className="text-sm text-moss-700 hover:text-moss-900">ver todos →</Link>
              </div>
              <div className="divide-y divide-bone-200">
                {data.recentOrders?.map((o) => (
                  <div key={orderRowId(o)} className="flex justify-between py-3 text-sm">
                    <div>
                      <span className="font-mono text-moss-700">#{orderRowId(o)}</span>
                      <span className="text-moss-500 mx-2">·</span>
                      <span className="text-moss-600">{formatOrderDate(o.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{formatBRL(o.total)}</span>
                      <span className={`badge ${orderStatusClass(o)}`}>{orderStatusLabel(o)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-xl text-moss-950 flex items-center gap-2">
                <ArrowLeftRight size={20} className="text-moss-600" />
                Movimentações recentes
              </h2>
              <Link to="/admin/movimentacoes" className="text-sm text-moss-700 hover:text-moss-900">ver todas →</Link>
            </div>
            {movements.length === 0 ? (
              <p className="text-sm text-moss-600">Nenhuma movimentação registrada.</p>
            ) : (
              <div className="divide-y divide-bone-200">
                {movements.map((m) => (
                  <div key={m.id} className="flex justify-between py-3 text-sm">
                    <div>
                      <span className="badge bg-moss-100 text-moss-700 mr-2">{m.type}</span>
                      <span className="text-moss-600">{formatMovementProduct(m)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono">{m.quantity > 0 ? `+${m.quantity}` : m.quantity}</span>
                      <span className="text-xs text-moss-500">{formatOrderDate(m.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
