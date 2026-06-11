import { useState } from 'react'
import { X } from 'lucide-react'
import { createAdmin } from '../lib/admin'

const EMPTY = { name: '', email: '', password: '' }

export function AdminFormModal({ onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await createAdmin(form)
      onSaved?.()
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
          <h2 className="font-display text-2xl text-moss-950">Novo administrador</h2>
          <button type="button" onClick={onClose} className="p-2 text-moss-600 hover:text-moss-900">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Nome</label>
            <input required value={form.name} onChange={set('name')} className="input" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">E-mail</label>
            <input type="email" required value={form.email} onChange={set('email')} className="input" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Senha</label>
            <input type="password" required minLength={8} value={form.password} onChange={set('password')} className="input" />
          </div>

          {error && <p className="text-sm text-clay-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Salvando…' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
