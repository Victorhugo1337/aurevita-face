import { useEffect, useState } from 'react'
import { Eye, Download } from 'lucide-react'
import { formatBRL } from '../../lib/format'
import {
  fetchAllOrders,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_STYLE,
  formatOrderDate,
} from '../../lib/orders'

export function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAllOrders()
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const customerName = (o) => o.representantName || o.distributorName || o.branchName || '—'

  return (
    <div className="p-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-moss-600 mb-2">Vendas</p>
          <h1 className="font-display text-4xl text-moss-950">Pedidos</h1>
        </div>
        <button className="btn-outline"><Download size={14} /> Exportar CSV</button>
      </div>

      {loading && <p className="text-moss-600 text-sm mb-6">Carregando pedidos…</p>}
      {error && <p className="text-clay-600 text-sm mb-6">{error}</p>}

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total',     v: orders.length },
          { label: 'Aprovados', v: orders.filter((o) => o.status === 'APPROVED').length },
          { label: 'Pendentes', v: orders.filter((o) => o.status === 'PENDING').length },
          { label: 'Enviados',  v: orders.filter((o) => o.status === 'SENT').length },
        ].map(({ label, v }) => (
          <div key={label} className="card p-4">
            <div className="text-xs uppercase tracking-widest text-moss-600">{label}</div>
            <div className="font-display text-3xl text-moss-950 mt-1">{v}</div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
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
              <tr key={o.orderId} className="hover:bg-bone-100/50">
                <td className="py-3 px-5 font-mono text-moss-700">#{o.orderId}</td>
                <td className="py-3 px-5 text-moss-950">{customerName(o)}</td>
                <td className="py-3 px-5 text-moss-600 font-mono text-xs">{formatOrderDate(o.createdAt)}</td>
                <td className="py-3 px-5 text-right font-medium">{formatBRL(o.total)}</td>
                <td className="py-3 px-5">
                  <span className={`badge ${ORDER_STATUS_STYLE[o.status] || 'bg-bone-200 text-moss-600'}`}>
                    {ORDER_STATUS_LABEL[o.status] || o.status}
                  </span>
                </td>
                <td className="py-3 px-5 text-right">
                  <button className="p-2 text-moss-600 hover:text-moss-900"><Eye size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
