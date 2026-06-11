import { useEffect, useState } from 'react'
import { Plus, Mail, Users } from 'lucide-react'
import { fetchUsers, fetchTeamForSenior } from '../lib/users'
import { getRoleLabel, ROLES } from '../lib/roles'
import { CustomerFormModal } from './CustomerFormModal'
import { useStore } from '../lib/store'

export function TeamManagementPanel({ seniorMode = false }) {
  const { user } = useStore()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    setLoading(true)
    setError('')
    const promise = seniorMode
      ? fetchTeamForSenior(user?.idSeniorDirector)
      : fetchUsers({ size: 200 }).then((res) => res)

    promise
      .then((res) => setMembers(res.content || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [seniorMode, user?.idSeniorDirector])

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-bone-200 bg-bone-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="font-display text-lg text-moss-950 flex items-center gap-2">
            <Users size={18} className="text-moss-600" />
            {seniorMode ? 'Equipe da rede' : 'Usuários do sistema'}
          </h2>
          <p className="text-xs text-moss-600 mt-1">
            {seniorMode
              ? 'Convide e gerencie diretores, distribuidores e representantes da sua operação.'
              : 'Todos os usuários cadastrados na plataforma.'}
          </p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="btn-primary shrink-0 w-full sm:w-auto justify-center">
          <Plus size={16} />
          {seniorMode ? 'Convidar parceiro' : 'Novo cliente'}
        </button>
      </div>

      {loading && <p className="p-5 text-sm text-moss-600">Carregando equipe…</p>}
      {error && (
        <p className="p-5 text-sm text-clay-600">
          {error}
          {seniorMode && (
            <span className="block mt-1 text-moss-600">
            </span>
          )}
        </p>
      )}

      {!loading && !error && (
        <div className="table-wrap">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-widest text-moss-600 border-b border-bone-200">
              <th className="py-3 px-5">Nome</th>
              <th className="py-3 px-5">E-mail</th>
              <th className="py-3 px-5">Perfil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bone-200">
            {members.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-moss-600">
                  Nenhum usuário na rede ainda. Use &quot;Convidar parceiro&quot; para cadastrar.
                </td>
              </tr>
            )}
            {members.map((m) => (
              <tr key={`${m.type}-${m.userId || m.id}-${m.email}`}>
                <td className="py-3 px-5 font-medium text-moss-950">{m.name}</td>
                <td className="py-3 px-5 text-moss-700">{m.email}</td>
                <td className="py-3 px-5">
                  <span className="badge bg-moss-100 text-moss-700">{getRoleLabel(m.type)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}

      {seniorMode && !loading && (
        <div className="px-5 py-3 border-t border-bone-200 bg-bone-50 text-xs text-moss-600 flex items-start gap-2">
          <Mail size={14} className="shrink-0 mt-0.5" />
        </div>
      )}

      {showForm && (
        <CustomerFormModal
          seniorMode={seniorMode}
          allowedTypes={
            seniorMode
              ? [ROLES.DIRECTOR, ROLES.DISTRIBUTOR, ROLES.REPRESENTANT]
              : undefined
          }
          onClose={() => setShowForm(false)}
          onSaved={load}
        />
      )}
    </div>
  )
}
