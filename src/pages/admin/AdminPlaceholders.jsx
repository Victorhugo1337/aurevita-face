import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Users, Building2, UserCircle, Network } from 'lucide-react'
import { fetchNetworkSummary, fetchClients } from '../../lib/admin'
import { getRoleLabel } from '../../lib/roles'
import { CustomerFormModal } from '../../components/CustomerFormModal'
import { AdminTeamPanel } from '../../components/AdminTeamPanel'
import { TeamManagementPanel } from '../../components/TeamManagementPanel'

export function AdminCustomers() {
  const [summary, setSummary] = useState(null)
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([
      fetchNetworkSummary(),
      fetchClients({ size: 100 }),
    ])
      .then(([net, list]) => {
        setSummary(net)
        setClients(list.content || [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const cards = summary ? [
    { label: 'Diretores sênior', value: summary.seniorDirectors, icon: Network },
    { label: 'Diretores', value: summary.directors, icon: Building2 },
    { label: 'Distribuidores', value: summary.distributors, icon: Users },
    { label: 'Representantes', value: summary.representants, icon: UserCircle },
    { label: 'Usuários', value: summary.users, icon: Users },
  ] : []

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-moss-600 mb-2">Base</p>
          <h1 className="page-title">Clientes</h1>
          <p className="text-moss-600 text-sm mt-2">Parceiros B2B da rede Aurevita.</p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="btn-primary w-full sm:w-auto shrink-0">
          <Plus size={16} /> Novo cliente
        </button>
      </div>

      {loading && <p className="text-moss-600 text-sm">Carregando…</p>}
      {error && <p className="text-clay-600 text-sm">{error}</p>}

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {cards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs uppercase tracking-widest text-moss-600">{label}</span>
                <Icon size={18} className="text-moss-400" />
              </div>
              <div className="font-display text-4xl text-moss-950">{value}</div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-bone-200 bg-bone-100">
            <h2 className="font-display text-lg text-moss-950">Parceiros cadastrados</h2>
          </div>
          <div className="table-wrap">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-moss-600 border-b border-bone-200">
                <th className="py-3 px-5">Nome</th>
                <th className="py-3 px-5">E-mail</th>
                <th className="py-3 px-5">Documento</th>
                <th className="py-3 px-5">Perfil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bone-200">
              {clients.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-moss-600">Nenhum parceiro cadastrado.</td>
                </tr>
              )}
              {clients.map((c) => (
                <tr key={c.userId}>
                  <td className="py-3 px-5 font-medium text-moss-950">{c.name}</td>
                  <td className="py-3 px-5 text-moss-700">{c.email}</td>
                  <td className="py-3 px-5 font-mono text-xs">{c.document || '—'}</td>
                  <td className="py-3 px-5">
                    <span className="badge bg-moss-100 text-moss-700">{getRoleLabel(c.type)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {showForm && (
        <CustomerFormModal onClose={() => setShowForm(false)} onSaved={load} />
      )}
    </div>
  )
}

export function AdminSettings() {
  return <PlatformSettings title="Configurações da plataforma" adminMode showTeam />
}

export function AppSettings() {
  return (
    <PlatformSettings
      title="Configurações"
      subtitle="Filiais, convites e gestão da equipe (acesso sênior)."
      showTeam
      seniorMode
    />
  )
}

function PlatformSettings({ title, subtitle, adminMode, showTeam, seniorMode }) {
  const [tab, setTab] = useState(seniorMode ? 'team' : 'admins')
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    import('../../lib/branches').then(({ fetchBranches }) =>
      fetchBranches()
        .then(setBranches)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false))
    )
  }, [])

  return (
    <div className="page">
      <div className="mb-8 lg:mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-moss-600 mb-2">Sistema</p>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="text-moss-600 text-sm mt-2">{subtitle}</p>}
      </div>

      {showTeam && (
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setTab(seniorMode ? 'team' : 'admins')}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              tab === (seniorMode ? 'team' : 'admins')
                ? 'bg-moss-800 text-bone-50'
                : 'bg-bone-200 text-moss-700 hover:bg-bone-300'
            }`}
          >
            {seniorMode ? 'Equipe e convites' : 'Administradores'}
          </button>
          <button
            type="button"
            onClick={() => setTab('branches')}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              tab === 'branches' ? 'bg-moss-800 text-bone-50' : 'bg-bone-200 text-moss-700 hover:bg-bone-300'
            }`}
          >
            Filiais
          </button>
        </div>
      )}

      {showTeam && tab === 'admins' && !seniorMode && (
        <div className="mb-8">
          <AdminTeamPanel />
        </div>
      )}

      {showTeam && tab === 'team' && seniorMode && (
        <div className="mb-8">
          <TeamManagementPanel seniorMode />
        </div>
      )}

      {(!showTeam || tab === 'branches') && (
        <>
          {loading && <p className="text-sm text-moss-600">Carregando filiais…</p>}
          {error && <p className="text-sm text-clay-600">{error}</p>}

          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-bone-200 bg-bone-100">
              <h2 className="font-display text-lg text-moss-950">Filiais</h2>
            </div>
            <div className="table-wrap">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-moss-600 border-b border-bone-200">
                  <th className="py-3 px-5">Nome</th>
                  <th className="py-3 px-5">Cidade</th>
                  <th className="py-3 px-5">UF</th>
                  <th className="py-3 px-5">CNPJ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bone-200">
                {branches.map((b) => (
                  <tr key={b.id}>
                    <td className="py-3 px-5 font-medium text-moss-950">{b.name}</td>
                    <td className="py-3 px-5 text-moss-700">{b.city || '—'}</td>
                    <td className="py-3 px-5 text-moss-700">{b.state || '—'}</td>
                    <td className="py-3 px-5 font-mono text-xs">{b.cnpj || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
