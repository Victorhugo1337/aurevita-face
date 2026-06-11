import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../lib/products'
import { formatBRL } from '../../lib/format'
import { ProductVisual } from '../../components/ProductVisual'
import { ProductFormModal } from '../../components/ProductFormModal'

export function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [modal, setModal] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    Promise.all([
      fetchProducts({ category: cat || undefined, search: q || undefined }),
      fetchCategories(),
    ])
      .then(([list, cats]) => {
        setProducts(list)
        setCategories(cats)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [cat, q])

  useEffect(() => {
    const t = setTimeout(load, q ? 300 : 0)
    return () => clearTimeout(t)
  }, [load, q])

  const catName = (slug) => categories.find((c) => c.slug === slug)?.name || slug

  const handleSave = async (form) => {
    if (modal?.id) await updateProduct(modal.id, form)
    else await createProduct(form)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Remover este produto?')) return
    try {
      await deleteProduct(id)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-moss-600 mb-2">Catálogo</p>
          <h1 className="font-display text-4xl text-moss-950">Produtos</h1>
        </div>
        <button type="button" onClick={() => setModal({})} className="btn-primary">
          <Plus size={16} /> Novo produto
        </button>
      </div>

      {loading && <p className="text-moss-600 text-sm mb-6">Carregando produtos…</p>}
      {error && <p className="text-clay-600 text-sm mb-6">{error}</p>}

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-moss-400" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome ou SKU..."
            className="input pl-11"
          />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="input max-w-xs">
          <option value="">Todas categorias</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-bone-100 border-b border-bone-200">
            <tr className="text-left text-xs uppercase tracking-widest text-moss-600">
              <th className="py-3 px-5">Produto</th>
              <th className="py-3 px-5">SKU</th>
              <th className="py-3 px-5">Categoria</th>
              <th className="py-3 px-5 text-right">Preço</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bone-200 text-sm">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-bone-100/50 transition">
                <td className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <ProductVisual product={p} className="w-10 h-12 rounded" />
                    <span className="font-medium text-moss-950">{p.name}</span>
                  </div>
                </td>
                <td className="py-3 px-5 font-mono text-xs text-moss-600">{p.sku}</td>
                <td className="py-3 px-5 text-moss-700">{catName(p.category)}</td>
                <td className="py-3 px-5 text-right">{formatBRL(p.price)}</td>
                <td className="py-3 px-5">
                  <span className={`badge ${p.active ? 'bg-moss-100 text-moss-700' : 'bg-bone-200 text-moss-600'}`}>
                    {p.active ? '● ativo' : '○ inativo'}
                  </span>
                </td>
                <td className="py-3 px-5">
                  <div className="flex gap-1 justify-end">
                    <button
                      type="button"
                      onClick={() => setModal(p)}
                      className="p-2 text-moss-600 hover:text-moss-900 hover:bg-bone-100 rounded"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-moss-600 hover:text-clay-600 hover:bg-bone-100 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-moss-500 mt-4 font-mono">{products.length} produtos</div>

      {modal && (
        <ProductFormModal
          product={modal.id ? modal : null}
          categories={categories}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
