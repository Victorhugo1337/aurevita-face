import { useEffect, useState } from 'react'
import { TrendingUp, Package, ShoppingCart, Users, ArrowUpRight } from 'lucide-react'
import { fetchProducts } from '../../lib/products'
import { fetchAllOrders } from '../../lib/orders'
import { formatBRL } from '../../lib/format'

export function Dashboard() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([fetchAllOrders(), fetchProducts()])
      .then(([o, p]) => {
        setOrders(o)
        setProducts(p)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const revenue = orders
    .filter((o) => o.status !== 'CANCELLED' && o.status !== 'REJECTED')
    .reduce((s, o) => s + Number(o.total), 0)

  const inactiveCount = products.filter((p) => !p.active).length

  const kpis = [
    { label: 'Receita',  value: formatBRL(revenue),              diff: `${orders.length} pedidos`, icon: TrendingUp },
    { label: 'Pedidos',  value: orders.length,                   diff: `${orders.filter((o) => o.status === 'PENDING').length} pendentes`, icon: ShoppingCart },
    { label: 'Produtos', value: products.length,                 diff: inactiveCount ? `${inactiveCount} inativos` : 'todos ativos', icon: Package },
    { label: 'Aprovados', value: orders.filter((o) => o.status === 'APPROVED').length, diff: 'no período', icon: Users },
  ]

  const chartData = [42, 58, 71, 49, 88, 64, 92, 76, 110, 94, 128, 138]
  const max = Math.max(...chartData)

  return (
    <div className="p-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-moss-600 mb-2">Visão geral</p>
          <h1 className="font-display text-4xl text-moss-950">Dashboard</h1>
        </div>
      </div>

      {loading && <p className="text-moss-600 text-sm mb-6">Carregando dados…</p>}
      {error && <p className="text-clay-600 text-sm mb-6">{error}</p>}

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

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-xl text-moss-950">Vendas dos últimos meses</h2>
            <select className="text-xs bg-transparent border border-moss-200 rounded-full px-3 py-1">
              <option>12 meses</option><option>6 meses</option><option>30 dias</option>
            </select>
          </div>
          <div className="flex items-end gap-2 h-48">
            {chartData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-moss-700 rounded-t hover:bg-moss-900 transition-all"
                  style={{ height: `${(v / max) * 100}%` }}
                />
                <span className="text-[10px] text-moss-500 font-mono">
                  {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-xl text-moss-950 mb-1">Produtos recentes</h2>
          <p className="text-xs text-moss-600 mb-6">Últimos do catálogo</p>
          <ul className="space-y-3">
            {products.slice(0, 4).map((p) => (
              <li key={p.id} className="flex justify-between items-center text-sm">
                <div>
                  <div className="text-moss-950">{p.name}</div>
                  <div className="text-xs text-moss-500 font-mono">{p.sku}</div>
                </div>
                <span className="badge bg-moss-100 text-moss-700">{formatBRL(p.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
