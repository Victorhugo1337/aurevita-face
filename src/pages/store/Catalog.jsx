import { useSearchParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ProductCard } from '../../components/ProductCard'
import { fetchProducts, deriveCategories } from '../../lib/products'
import { useStore } from '../../lib/store'

export function Catalog({ productBasePath = '/produto' }) {
  const { isAuthenticated } = useStore()
  const [params, setParams] = useSearchParams()
  const activeCat = params.get('cat')
  const [sort, setSort] = useState('relevance')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return

    setLoading(true)
    setError('')
    fetchProducts()
      .then((list) => {
        setProducts(list)
        setCategories(deriveCategories(list))
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  let list = products.filter((p) => p.active)
  if (activeCat) list = list.filter((p) => p.category === activeCat)
  if (sort === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
  if (sort === 'name')       list = [...list].sort((a, b) => a.name.localeCompare(b.name))

  const setCat = (cat) => {
    const next = new URLSearchParams(params)
    if (cat) next.set('cat', cat); else next.delete('cat')
    setParams(next)
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-4xl text-moss-950 mb-4">Catálogo</h1>
        <p className="text-moss-600 mb-8">Faça login para acessar o catálogo de produtos.</p>
        <Link to="/login" state={{ from: '/app/catalogo' }} className="btn-primary">Entrar</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <header className="mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-moss-600 mb-3">Catálogo</p>
        <h1 className="font-display text-5xl md:text-6xl text-moss-950">Todos os produtos</h1>
      </header>

      {loading && <p className="text-moss-600 text-sm mb-6">Carregando produtos…</p>}
      {error && <p className="text-clay-600 text-sm mb-6">{error}</p>}

      <div className="flex flex-col md:flex-row gap-10">
        <aside className="md:w-56 flex-shrink-0">
          <div className="text-xs uppercase tracking-widest text-moss-600 mb-4">Categorias</div>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setCat(null)}
                className={`text-left text-sm transition ${!activeCat ? 'text-moss-900 font-medium' : 'text-moss-600 hover:text-moss-900'}`}
              >
                Todas
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <button
                  onClick={() => setCat(cat.slug)}
                  className={`text-left text-sm transition ${activeCat === cat.slug ? 'text-moss-900 font-medium' : 'text-moss-600 hover:text-moss-900'}`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-moss-600">{list.length} produtos</span>
            <select
              value={sort} onChange={(e) => setSort(e.target.value)}
              className="text-sm bg-transparent border-b border-moss-300 py-1 pr-6 focus:outline-none focus:border-moss-700"
            >
              <option value="relevance">Relevância</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="name">Nome A-Z</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((p) => <ProductCard key={p.id} product={p} productBasePath={productBasePath} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
