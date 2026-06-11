import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Minus, Plus, ArrowLeft, Check } from 'lucide-react'
import { fetchProductById } from '../../lib/products'
import { formatBRL } from '../../lib/format'
import { ProductVisual } from '../../components/ProductVisual'
import { useStore } from '../../lib/store'

export function ProductDetail({ catalogPath = '/loja' }) {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const { add, isAuthenticated, user } = useStore()

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    fetchProductById(id, user)
      .then(setProduct)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, isAuthenticated, user?.userId])

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-4xl text-moss-950 mb-4">Produto</h1>
        <p className="text-moss-600 mb-8">Faça login para ver os detalhes do produto.</p>
        <Link to="/login" state={{ from: `/app/produto/${id}` }} className="btn-primary">Entrar</Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center text-moss-600">
        Carregando produto…
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-4xl text-moss-950 mb-4">Produto não encontrado</h1>
        {error && <p className="text-clay-600 text-sm mb-4">{error}</p>}
        <Link to={catalogPath} className="text-moss-700 hover:text-moss-900">← voltar ao catálogo</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link to={catalogPath} className="inline-flex items-center gap-2 text-sm text-moss-600 hover:text-moss-900 mb-6 sm:mb-8">
        <ArrowLeft size={14} /> voltar
      </Link>

      <div className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
        <ProductVisual product={product} className="aspect-square rounded-xl2" />

        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.3em] text-moss-600 mb-3">{product.tags?.[0]}</p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-moss-950 mb-4 leading-tight">{product.name}</h1>
          <p className="text-base sm:text-lg text-moss-700 mb-6 sm:mb-8 leading-relaxed">{product.short}</p>

          <div className="font-display text-3xl sm:text-4xl text-ink mb-2">{formatBRL(product.price)}</div>
          {product.priceLevelLabel && (
            <p className="text-xs text-moss-600 mb-2">{product.priceLevelLabel}</p>
          )}
          <div className="text-xs text-moss-600 mb-8">
            ou 3x de {formatBRL(product.price / 3)} sem juros
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-moss-300 rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:text-moss-900">
                <Minus size={14} />
              </button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:text-moss-900">
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={() => add(product, qty)}
              className="flex-1 btn-primary"
            >
              Adicionar ao carrinho
            </button>
          </div>

          <ul className="space-y-2 mt-6 pt-6 border-t border-bone-200">
            {['Entrega para todo Brasil', 'Lote rastreável', 'Trocas em até 7 dias'].map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-moss-700">
                <Check size={14} className="text-moss-600" /> {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
