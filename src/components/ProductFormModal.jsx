import { useEffect, useState } from 'react'
import { Trash2, X } from 'lucide-react'
import {
  PRODUCT_PRICE_TYPES,
  resolveCategorySlug,
  deleteProductPrice,
  deleteProductImage,
} from '../lib/products'
import { formatBRL } from '../lib/format'
import { getRoleLabel } from '../lib/roles'

const EMPTY = { name: '', description: '', sku: '', brand: '', category: '', unit: '' }

const SKU_HINTS = {
  chas: 'Ex.: CHA-001',
  'em-po': 'Ex.: WHE-001 ou CRE-001',
  capsulas: 'Ex.: MUL-001',
  bebidas: 'Ex.: ISO-001',
  'bebidas-energeticas': 'Ex.: ENE-001',
  outros: 'Ex.: PRD-001',
}

function priceTypeLabel(type) {
  return PRODUCT_PRICE_TYPES.find((t) => t.value === type)?.label || getRoleLabel(type) || type || 'Geral'
}

export function ProductFormModal({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY)
  const [price, setPrice] = useState('')
  const [priceType, setPriceType] = useState('REPRESENTANT')
  const [imageFile, setImageFile] = useState(null)
  const [prices, setPrices] = useState([])
  const [images, setImages] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || product.short || '',
        sku: product.sku || '',
        brand: product.brand || '',
        category: resolveCategorySlug(product.category, categories),
        unit: product.unit || '',
      })
      setPrices(product.prices || [])
      setImages(product.images || [])
    } else {
      setForm(EMPTY)
      setPrices([])
      setImages([])
    }
    setPrice('')
    setPriceType('REPRESENTANT')
    setImageFile(null)
    setError('')
  }, [product, categories])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const removePrice = async (priceId) => {
    if (!confirm('Remover este preço?')) return
    try {
      await deleteProductPrice(priceId)
      setPrices((list) => list.filter((p) => p.id !== priceId))
    } catch (err) {
      setError(err.message)
    }
  }

  const removeImage = async (imageId) => {
    if (!confirm('Remover esta imagem?')) return
    try {
      await deleteProductImage(imageId)
      setImages((list) => list.filter((img) => img.id !== imageId))
    } catch (err) {
      setError(err.message)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave({
        form,
        price: price !== '' ? Number(price) : null,
        priceType,
        imageFile,
      })
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const skuHint = SKU_HINTS[form.category] || 'Prefixo do SKU define a categoria exibida'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-moss-950/50" onClick={onClose}>
      <div className="card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-2xl text-moss-950">
            {product ? 'Editar produto' : 'Novo produto'}
          </h2>
          <button type="button" onClick={onClose} className="p-2 text-moss-600 hover:text-moss-900">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Nome *</label>
            <input required value={form.name} onChange={set('name')} className="input" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Descrição</label>
            <textarea value={form.description} onChange={set('description')} className="input min-h-[80px]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">SKU</label>
              <input
                value={form.sku}
                onChange={set('sku')}
                className="input"
                placeholder={skuHint}
              />
              <p className="text-[11px] text-moss-500 mt-1">{skuHint}</p>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Marca</label>
              <input value={form.brand} onChange={set('brand')} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Categoria *</label>
              <select required value={form.category} onChange={set('category')} className="input">
                <option value="">Selecione…</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Unidade</label>
              <input value={form.unit} onChange={set('unit')} className="input" placeholder="UN, KG…" />
            </div>
          </div>

          <div className="pt-2 border-t border-bone-200">
            <p className="text-xs uppercase tracking-widest text-moss-600 mb-3">Preço</p>
            {product?.standardPrice > 0 && (
              <p className="text-sm text-moss-700 mb-3">
                Tabela padrão: <span className="font-medium">{formatBRL(product.standardPrice)}</span>
              </p>
            )}
            {!product && (
              <p className="text-xs text-moss-500 mb-3">
                Sem preço informado, a API aplica R$ 29,90 nas tabelas por perfil.
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-moss-600 mb-2">Valor (R$)</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="input"
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="block text-xs text-moss-600 mb-2">Perfil</label>
                <select value={priceType} onChange={(e) => setPriceType(e.target.value)} className="input">
                  {PRODUCT_PRICE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {prices.length > 0 && (
              <ul className="mt-3 space-y-2">
                {prices.map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-sm bg-bone-100 rounded-lg px-3 py-2">
                    <span className="text-moss-800">
                      {priceTypeLabel(p.type)} — {formatBRL(p.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePrice(p.id)}
                      className="p-1.5 text-moss-600 hover:text-clay-600 rounded"
                      aria-label="Remover preço"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pt-2 border-t border-bone-200">
            <p className="text-xs uppercase tracking-widest text-moss-600 mb-3">Imagem</p>
            {images[0]?.url && (
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={images[0].url}
                  alt={form.name || 'Produto'}
                  className="w-16 h-16 rounded object-cover border border-bone-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(images[0].id)}
                  className="text-xs text-clay-600 hover:text-clay-700"
                >
                  Remover imagem
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-moss-700 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-moss-100 file:text-moss-800"
            />
            {!product && (
              <p className="text-xs text-moss-500 mt-2">A imagem é enviada após criar o produto.</p>
            )}
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
