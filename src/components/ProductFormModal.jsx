import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const EMPTY = { name: '', description: '', sku: '', brand: '', category: '', unit: '' }

export function ProductFormModal({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || product.short || '',
        sku: product.sku || '',
        brand: product.brand || '',
        category: product.category || '',
        unit: product.unit || '',
      })
    } else {
      setForm(EMPTY)
    }
  }, [product])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave(form)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-moss-950/50" onClick={onClose}>
      <div className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-2xl text-moss-950">
            {product ? 'Editar produto' : 'Novo produto'}
          </h2>
          <button onClick={onClose} className="p-2 text-moss-600 hover:text-moss-900">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Nome</label>
            <input required value={form.name} onChange={set('name')} className="input" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Descrição</label>
            <textarea value={form.description} onChange={set('description')} className="input min-h-[80px]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">SKU</label>
              <input value={form.sku} onChange={set('sku')} className="input" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Marca</label>
              <input value={form.brand} onChange={set('brand')} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Categoria</label>
              <select required value={form.category} onChange={set('category')} className="input">
                <option value="">Selecione…</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Unidade</label>
              <input value={form.unit} onChange={set('unit')} className="input" placeholder="un, kg…" />
            </div>
          </div>

          {error && <p className="text-sm text-clay-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
