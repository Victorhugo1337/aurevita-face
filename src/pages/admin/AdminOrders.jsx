import { useEffect, useState } from 'react'
import { Eye, Download } from 'lucide-react'
import { formatBRL } from '../../lib/format'
import {
  fetchAllOrders,
  orderStatusLabel,
  orderStatusClass,
  formatOrderDate,
  orderRowId,
} from '../../lib/orders'
import { OrderDetailModal } from '../../components/OrderDetailModal'
import { useStore } from '../../lib/store'

export function AdminOrders() {
  const { user } = useStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const load = () => {
    setLoading(true)
    fetchAllOrders()
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const customerName = (o) => o.representantName || o.distributorName || o.branchName || '—'

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-moss-600 mb-2">Vendas</p>
          <h1 className="page-title">Pedidos</h1>
        </div>
        <button type="button" className="btn-outline w-full sm:w-auto shrink-0"><Download size={14} /> Exportar CSV</button>
      </div>

      {loading && <p className="text-moss-600 text-sm mb-6">Carregando pedidos…</p>}
      {error && <p className="text-clay-600 text-sm mb-6">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', v: orders.length },
          { label: 'Pendentes', v: orders.filter((o) => orderStatusLabel(o) === 'pendente').length },
          { label: 'Aprovados', v: orders.filter((o) => orderStatusLabel(o) === 'aprovado').length },
          { label: 'Enviados', v: orders.filter((o) => orderStatusLabel(o) === 'enviado').length },
        ].map(({ label, v }) => (
          <div key={label} className="card p-4">
            <div className="text-xs uppercase tracking-widest text-moss-600">{label}</div>
            <div className="font-display text-3xl text-moss-950 mt-1">{v}</div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="table-wrap">
        <table className="w-full text-sm">
          <thead className="bg-bone-100 border-b border-bone-200">
            <tr className="text-left text-xs uppercase tracking-widest text-moss-600">
              <th className="py-3 px-5">Pedido</th>
              <th className="py-3 px-5">Cliente</th>
              <th className="py-3 px-5">Data</th>
              <th className="py-3 px-5 text-right">Total</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bone-200">
            {orders.map((o) => (
              <tr key={orderRowId(o)} className="hover:bg-bone-100/50">
                <td className="py-3 px-5 font-mono text-moss-700">#{orderRowId(o)}</td>
                <td className="py-3 px-5 text-moss-950">{customerName(o)}</td>
                <td className="py-3 px-5 text-moss-600 font-mono text-xs">{formatOrderDate(o.createdAt)}</td>
                <td className="py-3 px-5 text-right font-medium">{formatBRL(o.total)}</td>
                <td className="py-3 px-5">
                  <span className={`badge ${orderStatusClass(o)}`}>{orderStatusLabel(o)}</span>
                </td>
                <td className="py-3 px-5 text-right">
                  <button
                    type="button"
                    onClick={() => setSelectedId(orderRowId(o))}
                    className="p-2 text-moss-600 hover:text-moss-900"
                  >
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {selectedId && (
        <OrderDetailModal
          orderId={selectedId}
          role={user?.role}
          onClose={() => setSelectedId(null)}
          onUpdated={load}
        />
      )}
    </div>
  )
}
