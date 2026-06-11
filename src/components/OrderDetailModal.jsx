import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import {
  fetchOrderById,
  patchOrder,
  orderStatusLabel,
  orderStatusClass,
  orderStatusKey,
  formatOrderDate,
} from '../lib/orders'
import { formatBRL } from '../lib/format'
import { ROLES } from '../lib/roles'

function canWorkflow(role, action) {
  if (action === 'cancel') return true
  return [ROLES.ADMIN, ROLES.SENIOR, ROLES.DIRECTOR, ROLES.DISTRIBUTOR].includes(role)
}

const ACTIONS = {
  PENDING: [
    { action: 'approve', label: 'Aprovar', className: 'btn-primary' },
    { action: 'reject', label: 'Rejeitar', className: 'btn-outline' },
    { action: 'cancel', label: 'Cancelar', className: 'btn-ghost' },
  ],
  APPROVED: [
    { action: 'send', label: 'Enviar', className: 'btn-primary' },
    { action: 'cancel', label: 'Cancelar', className: 'btn-ghost' },
  ],
  SENT: [
    { action: 'deliver', label: 'Confirmar entrega', className: 'btn-primary' },
    { action: 'cancel', label: 'Cancelar', className: 'btn-ghost' },
  ],
}

export function OrderDetailModal({ orderId, role, onClose, onUpdated }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [acting, setActing] = useState(false)

  useEffect(() => {
    fetchOrderById(orderId)
      .then(setOrder)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [orderId])

  const runAction = async (action) => {
    setActing(true)
    setError('')
    try {
      const updated = await patchOrder(orderId, action)
      setOrder(updated)
      onUpdated?.(updated)
    } catch (e) {
      setError(e.message)
    } finally {
      setActing(false)
    }
  }

  const statusKey = order ? orderStatusKey(order) : null
  const available = (ACTIONS[statusKey] || []).filter(({ action }) => canWorkflow(role, action))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-moss-950/50" onClick={onClose}>
      <div
        className="card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-moss-600 mb-1">Pedido</p>
            <h2 className="font-display text-3xl text-moss-950">#{orderId}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-moss-600 hover:text-moss-900">
            <X size={18} />
          </button>
        </div>

        {loading && <p className="text-sm text-moss-600">Carregando…</p>}
        {error && <p className="text-sm text-clay-600 mb-4">{error}</p>}

        {order && (
          <>
            <dl className="grid grid-cols-2 gap-3 text-sm mb-6">
              <div>
                <dt className="text-moss-600">Data</dt>
                <dd className="font-mono">{formatOrderDate(order.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-moss-600">Status</dt>
                <dd>
                  <span className={`badge ${orderStatusClass(order)}`}>
                    {orderStatusLabel(order)}
                  </span>
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-moss-600">Total</dt>
                <dd className="font-display text-2xl">{formatBRL(order.total)}</dd>
              </div>
            </dl>

            <h3 className="text-xs uppercase tracking-widest text-moss-600 mb-3">Itens</h3>
            <ul className="divide-y divide-bone-200 mb-6">
              {(order.items || []).map((item) => (
                <li key={item.id} className="py-3 flex justify-between text-sm">
                  <div>
                    <div className="text-moss-950">{item.productName}</div>
                    <div className="text-xs font-mono text-moss-500">{item.productCode}</div>
                  </div>
                  <div className="text-right">
                    <div>{item.quantity} un</div>
                    <div className="font-medium">{formatBRL(item.subtotal)}</div>
                  </div>
                </li>
              ))}
            </ul>

            {available.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {available.map(({ action, label, className }) => (
                  <button
                    key={action}
                    type="button"
                    disabled={acting}
                    onClick={() => runAction(action)}
                    className={`${className} text-sm py-2 px-4`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
