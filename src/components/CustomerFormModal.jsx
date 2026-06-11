import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { ROLES } from '../lib/roles'
import { createClient } from '../lib/admin'
import { fetchBranches } from '../lib/branches'
import {
  createUser,
  createRepresentant,
  createDistributor,
  createDirector,
  fetchSeniorDirectors,
  fetchDirectors,
  fetchDistributors,
} from '../lib/users'
import { useStore } from '../lib/store'

const EMPTY = {
  name: '',
  email: '',
  password: '',
  document: '',
  type: ROLES.REPRESENTANT,
  idSeniorDirector: '',
  idDistributor: '',
  idDirector: '',
  idBranch: '',
}

export function CustomerFormModal({ onClose, onSaved, seniorMode = false, allowedTypes }) {
  const { user } = useStore()
  const types = allowedTypes || [ROLES.REPRESENTANT, ROLES.DISTRIBUTOR, ROLES.DIRECTOR, ROLES.SENIOR]
  const [form, setForm] = useState({ ...EMPTY, type: types[0] })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [seniors, setSeniors] = useState([])
  const [directors, setDirectors] = useState([])
  const [distributors, setDistributors] = useState([])
  const [branches, setBranches] = useState([])

  useEffect(() => {
    if (seniorMode) return
    Promise.all([
      fetchSeniorDirectors({ size: 200 }),
      fetchDirectors({ size: 200 }),
      fetchDistributors({ size: 200 }),
      fetchBranches(),
    ])
      .then(([s, d, dist, b]) => {
        setSeniors(s.content || [])
        setDirectors(d.content || [])
        setDistributors(dist.content || [])
        setBranches(b || [])
      })
      .catch(() => {})
  }, [seniorMode])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submitAdminClient = async () => {
    const body = {
      type: form.type,
      name: form.name,
      document: form.document,
      email: form.email,
      password: form.password,
    }
    if (form.type === ROLES.DIRECTOR) {
      body.idSeniorDirector = Number(form.idSeniorDirector)
    }
    if (form.type === ROLES.DISTRIBUTOR) {
      body.idDirector = Number(form.idDirector)
      if (form.idBranch) body.idBranch = Number(form.idBranch)
    }
    if (form.type === ROLES.REPRESENTANT) {
      body.idDistributor = Number(form.idDistributor)
    }
    await createClient(body)
  }

  const submitSeniorInvite = async () => {
    const userBody = {
      name: form.name,
      email: form.email,
      password: form.password,
      type: form.type,
      idSeniorDirector: user?.idSeniorDirector,
      idDistributor: form.idDistributor ? Number(form.idDistributor) : null,
      idDirector: form.idDirector ? Number(form.idDirector) : null,
    }
    const created = await createUser(userBody)

    if (form.type === ROLES.REPRESENTANT) {
      await createRepresentant({
        name: form.name,
        email: form.email,
        idUser: created.id,
        idDistributor: Number(form.idDistributor),
      })
    } else if (form.type === ROLES.DISTRIBUTOR) {
      await createDistributor({
        name: form.name,
        email: form.email,
        idUser: created.id,
        idDirector: Number(form.idDirector),
      })
    } else if (form.type === ROLES.DIRECTOR) {
      await createDirector({
        name: form.name,
        email: form.email,
        idUser: created.id,
        idSeniorDirector: user?.idSeniorDirector,
      })
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (seniorMode) {
        await submitSeniorInvite()
      } else {
        await submitAdminClient()
      }
      onSaved?.()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const title = seniorMode ? 'Convidar parceiro' : 'Novo cliente'

  const selectClass = 'input'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-moss-950/50" onClick={onClose}>
      <div className="card w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-2xl text-moss-950">{title}</h2>
          <button type="button" onClick={onClose} className="p-2 text-moss-600 hover:text-moss-900">
            <X size={18} />
          </button>
        </div>

        {seniorMode && (
          <p className="text-xs text-moss-600 mb-4 -mt-2">
            Cadastro com senha temporária — repasse as credenciais manualmente ao parceiro.
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Nome</label>
            <input required value={form.name} onChange={set('name')} className="input" />
          </div>
          {!seniorMode && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">CPF/CNPJ</label>
              <input required value={form.document} onChange={set('document')} className="input" placeholder="12345678901" />
            </div>
          )}
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">E-mail</label>
            <input type="email" required value={form.email} onChange={set('email')} className="input" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">
              {seniorMode ? 'Senha temporária' : 'Senha'}
            </label>
            <input type="password" required minLength={8} value={form.password} onChange={set('password')} className="input" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Tipo</label>
            <select value={form.type} onChange={set('type')} className="input">
              {types.includes(ROLES.REPRESENTANT) && (
                <option value={ROLES.REPRESENTANT}>Representante</option>
              )}
              {types.includes(ROLES.DISTRIBUTOR) && (
                <option value={ROLES.DISTRIBUTOR}>Distribuidor</option>
              )}
              {types.includes(ROLES.DIRECTOR) && (
                <option value={ROLES.DIRECTOR}>Diretor</option>
              )}
              {types.includes(ROLES.SENIOR) && (
                <option value={ROLES.SENIOR}>Diretor sênior</option>
              )}
            </select>
          </div>

          {form.type === ROLES.DIRECTOR && !seniorMode && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Diretor sênior</label>
              <select required value={form.idSeniorDirector} onChange={set('idSeniorDirector')} className={selectClass}>
                <option value="">Selecione…</option>
                {seniors.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          {form.type === ROLES.DISTRIBUTOR && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Diretor</label>
              {seniorMode ? (
                <input type="number" required={!seniorMode} value={form.idDirector} onChange={set('idDirector')} className="input" />
              ) : (
                <select required value={form.idDirector} onChange={set('idDirector')} className={selectClass}>
                  <option value="">Selecione…</option>
                  {directors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {form.type === ROLES.DISTRIBUTOR && !seniorMode && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Filial (opcional)</label>
              <select value={form.idBranch} onChange={set('idBranch')} className={selectClass}>
                <option value="">Nenhuma</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}

          {form.type === ROLES.REPRESENTANT && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Distribuidor</label>
              {seniorMode ? (
                <input type="number" required={!seniorMode} value={form.idDistributor} onChange={set('idDistributor')} className="input" />
              ) : (
                <select required value={form.idDistributor} onChange={set('idDistributor')} className={selectClass}>
                  <option value="">Selecione…</option>
                  {distributors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {error && <p className="text-sm text-clay-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Salvando…' : seniorMode ? 'Enviar convite' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
