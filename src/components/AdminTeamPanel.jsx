import { useEffect, useState } from 'react'
import { Plus, Shield } from 'lucide-react'
import { fetchUsers } from '../lib/users'
import { AdminFormModal } from './AdminFormModal'

export function AdminTeamPanel() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    setLoading(true)
    setError('')
    fetchUsers({ size: 200 })
      .then((res) => setAdmins((res.content || []).filter((u) => u.type === 'ADMIN')))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-bone-200 bg-bone-100 flex justify-between items-center gap-4">
        <div>
          <h2 className="font-display text-lg text-moss-950 flex items-center gap-2">
            <Shield size={18} className="text-moss-600" />
            Administradores da plataforma
          </h2>
          <p className="text-xs text-moss-600 mt-1">
            Equipe interna Aurevita com acesso ao painel /admin.
          </p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="btn-primary shrink-0">
          <Plus size={16} /> Novo admin
        </button>
      </div>

      {loading && <p className="p-5 text-sm text-moss-600">Carregando…</p>}
      {error && <p className="p-5 text-sm text-clay-600">{error}</p>}

      {!loading && !error && (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-widest text-moss-600 border-b border-bone-200">
              <th className="py-3 px-5">Nome</th>
              <th className="py-3 px-5">E-mail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bone-200">
            {admins.length === 0 && (
              <tr>
                <td colSpan={2} className="py-8 text-center text-moss-600">
                  Nenhum administrador cadastrado.
                </td>
              </tr>
            )}
            {admins.map((a) => (
              <tr key={a.id}>
                <td className="py-3 px-5 font-medium text-moss-950">{a.name}</td>
                <td className="py-3 px-5 text-moss-700">{a.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <AdminFormModal onClose={() => setShowForm(false)} onSaved={load} />
      )}
    </div>
  )
}
