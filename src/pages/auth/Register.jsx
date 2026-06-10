import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [err, setErr] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    setErr('')
    if (form.password !== form.confirm) return setErr('As senhas não conferem.')
    setErr('Cadastro disponível apenas pelo administrador. Entre em contato ou use uma conta existente.')
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex bg-moss-950 text-bone-50 p-12 flex-col justify-between relative overflow-hidden">
        <Link to="/" className="text-bone-100 hover:text-bone-50 flex items-center gap-2 text-sm relative z-10">
          <ArrowLeft size={14} /> voltar à loja
        </Link>
        <div className="absolute top-10 -left-10 w-72 h-72 bg-clay-500 rounded-full opacity-30" />
        <div className="absolute bottom-1/4 -right-10 w-80 h-80 bg-moss-800 rounded-full opacity-60" />
        <div className="relative z-10">
          <div className="font-display text-5xl leading-tight mb-4">
            Comece sua<br /><em className="text-moss-300">jornada.</em>
          </div>
          <p className="text-bone-200 max-w-sm text-sm leading-relaxed">
            Crie sua conta para receber recomendações personalizadas
            e acompanhar seus pedidos.
          </p>
        </div>
        <div className="text-xs font-mono text-moss-400 relative z-10">presence / signup</div>
      </div>

      <div className="flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-8">
            <Link to="/" className="font-display text-2xl text-moss-900">Presence</Link>
          </div>
          <h1 className="font-display text-4xl text-moss-950 mb-2">Cadastro</h1>
          <p className="text-moss-600 text-sm mb-10">
            Já tem conta?{' '}
            <Link to="/login" className="text-moss-900 underline underline-offset-4">entrar</Link>
          </p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Nome</label>
              <input required value={form.name} onChange={set('name')} className="input" placeholder="Como podemos te chamar" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">E-mail</label>
              <input type="email" required value={form.email} onChange={set('email')} className="input" placeholder="seu@email.com" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Senha</label>
                <input type="password" required value={form.password} onChange={set('password')} className="input" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-moss-600 mb-2">Confirmar</label>
                <input type="password" required value={form.confirm} onChange={set('confirm')} className="input" placeholder="••••••••" />
              </div>
            </div>
            {err && <p className="text-sm text-clay-600">{err}</p>}
            <button type="submit" className="btn-primary w-full mt-2">Criar conta</button>
          </form>
        </div>
      </div>
    </div>
  )
}
