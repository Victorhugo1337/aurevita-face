import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Minus, Plus, X, ShoppingBag } from 'lucide-react'
import { useStore } from '../../lib/store'
import { ProductVisual } from '../../components/ProductVisual'
import { formatBRL } from '../../lib/format'
import { createOrder } from '../../lib/orders'

export function Cart({ catalogPath = '/loja' }) {
  const { cart, setQty, remove, total, clear } = useStore()
  const nav = useNavigate()
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState('')

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center">
        <ShoppingBag size={48} className="mx-auto text-moss-300 mb-6" strokeWidth={1} />
        <h1 className="font-display text-4xl text-moss-950 mb-3">Seu carrinho está vazio.</h1>
        <p className="text-moss-600 mb-8">Que tal explorar nossos produtos?</p>
        <Link to={catalogPath} className="btn-primary">Ver produtos</Link>
      </div>
    )
  }

  const shipping = total >= 199 ? 0 : 24.90

  const checkout = async () => {
    setCheckingOut(true)
    setError('')
    try {
      await createOrder(cart)
      clear()
      nav('/app/pedidos')
    } catch (e) {
      setError(e.message)
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <h1 className="font-display text-3xl sm:text-5xl text-moss-950 mb-8 sm:mb-12">Carrinho</h1>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 divide-y divide-bone-200">
          {cart.map(({ product, qty }) => (
            <div key={product.id} className="flex gap-5 py-6">
              <ProductVisual product={product} className="w-24 h-28 rounded-xl flex-shrink-0" />
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl text-moss-950">{product.name}</h3>
                    <p className="text-xs text-moss-500 font-mono mt-1">{product.sku}</p>
                    {product.priceSource === 'negotiated' && (
                      <span className="inline-block mt-1 text-[10px] uppercase tracking-widest text-clay-600">
                        preço negociado
                      </span>
                    )}
                  </div>
                  <button type="button" onClick={() => remove(product.id)} className="text-moss-400 hover:text-moss-900">
                    <X size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-moss-300 rounded-full">
                    <button type="button" onClick={() => setQty(product.id, qty - 1)} className="p-2"><Minus size={12} /></button>
                    <span className="w-8 text-center text-sm">{qty}</span>
                    <button type="button" onClick={() => setQty(product.id, qty + 1)} className="p-2"><Plus size={12} /></button>
                  </div>
                  <span className="font-display text-lg">{formatBRL(product.price * qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="card p-6 h-fit lg:sticky lg:top-28">
          <h2 className="font-display text-2xl text-moss-950 mb-6">Resumo</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatBRL(total)}</dd></div>
            <div className="flex justify-between">
              <dt>Frete</dt>
              <dd>{shipping === 0 ? <span className="text-moss-700">Grátis</span> : formatBRL(shipping)}</dd>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-moss-500">Faltam {formatBRL(199 - total)} para frete grátis.</p>
            )}
          </dl>
          <div className="border-t border-bone-200 mt-6 pt-6 flex justify-between font-display text-2xl">
            <span>Total</span><span>{formatBRL(total + shipping)}</span>
          </div>
          {error && <p className="text-sm text-clay-600 mt-4">{error}</p>}
          <button
            type="button"
            disabled={checkingOut}
            onClick={checkout}
            className="btn-primary w-full mt-6"
          >
            {checkingOut ? 'Enviando pedido…' : 'Finalizar compra'}
          </button>
          <Link to={catalogPath} className="block text-center text-sm text-moss-600 hover:text-moss-900 mt-4">
            continuar comprando
          </Link>
        </aside>
      </div>
    </div>
  )
}
