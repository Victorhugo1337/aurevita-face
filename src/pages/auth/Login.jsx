import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useStore } from '../../lib/store'

import { getHomeRoute } from '../../lib/roles'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const { login, authLoading } = useStore()
  const nav = useNavigate()
  const loc = useLocation()
  const from = loc.state?.from

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const user = await login(email, password)
      const home = getHomeRoute(user.role)
      const dest = from && from !== '/' && from !== '/login' ? from : home
      nav(dest)
    } catch (error) {
      setErr(error.message || 'Credenciais inválidas.')
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex bg-moss-950 text-bone-50 p-12 flex-col justify-between relative overflow-hidden">
        <Link to="/" className="text-bone-100 hover:text-bone-50 flex items-center gap-2 text-sm relative z-10">
          <ArrowLeft size={14} /> voltar à loja
        </Link>

        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-moss-800 rounded-full opacity-50" />
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-clay-500 rounded-full opacity-40" />

        <div className="relative z-10">
          <div className="font-display text-5xl leading-tight mb-4">
            Bem-vindo<br /><em className="text-moss-300">de volta.</em>
          </div>
          <p className="text-bone-200 max-w-sm text-sm leading-relaxed">
            Acompanhe seus pedidos, gerencie suas assinaturas e descubra
            novos produtos pensados para o seu equilíbrio.
          </p>
        </div>

        <div className="text-xs font-mono text-moss-400 relative z-10">
          presence / login — v1.0
        </div>
      </div>

      <div className="flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-8">
            <Link to="/" className="font-display text-2xl text-moss-900">Presence</Link>
          </div>

          <h1 className="font-display text-4xl text-moss-950 mb-2">Entrar</h1>
          <p className="text-moss-600 text-sm mb-10">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-moss-900 underline underline-offset-4">cadastre-se</Link>
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">E-mail</label>
              <input
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="input"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-xs uppercase tracking-widest text-moss-600">Senha</label>
                <a href="#" className="text-xs text-moss-600 hover:text-moss-900">esqueci</a>
              </div>
              <input
                type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
              />
            </div>

            {err && <p className="text-sm text-clay-600">{err}</p>}

            <button type="submit" disabled={authLoading} className="btn-primary w-full mt-2">
              {authLoading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
