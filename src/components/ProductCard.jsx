import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { ProductVisual } from './ProductVisual'
import { useStore } from '../lib/store'
import { formatBRL } from '../lib/format'

export function ProductCard({ product, productBasePath = '/produto' }) {
  const { add } = useStore()
  return (
    <div className="group card overflow-hidden hover:border-moss-300 transition-all duration-300">
      <Link to={`${productBasePath}/${product.id}`} className="block">
        <ProductVisual product={product} className="aspect-[4/5] rounded-t-xl2" />
      </Link>
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-moss-600 mb-1">
          {product.tags?.[0]}
        </p>
        <Link to={`${productBasePath}/${product.id}`}>
          <h3 className="font-display text-xl text-moss-900 leading-tight mb-2 group-hover:text-moss-700">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-moss-600 line-clamp-2 mb-4 min-h-[40px]">
          {product.short}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl text-ink">{formatBRL(product.price)}</span>
          <button
            onClick={() => add(product)}
            className="p-2.5 rounded-full bg-moss-900 text-bone-50 hover:bg-moss-700 transition"
            aria-label="Adicionar ao carrinho"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
