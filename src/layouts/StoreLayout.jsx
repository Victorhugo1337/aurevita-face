import { Link, Outlet } from 'react-router-dom'
import { Instagram, Facebook } from 'lucide-react'
import { useStore } from '../lib/store'
import { getHomeRoute } from '../lib/roles'
import { ApiDocsLink } from '../components/ApiDocsLink'

export function StoreLayout() {
  const { user, isAuthenticated, isAdmin, isAppUser } = useStore()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-bone-50 border-b border-bone-200 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl tracking-tightest text-moss-900">Aurevita</span>
            <span className="text-xs text-moss-500 font-mono hidden sm:inline">/ gestão comercial</span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <ApiDocsLink
              label="Docs API"
              className="text-sm text-moss-600 hover:text-moss-900 inline-flex items-center gap-1.5 transition"
            />
            {isAuthenticated ? (
              <Link
                to={getHomeRoute(user.role)}
                className="text-sm font-medium text-moss-900 hover:text-moss-700 transition"
              >
                Ir para o painel
              </Link>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2.5 px-5">
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="bg-moss-950 text-bone-100">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="font-display text-3xl text-bone-50 mb-3">Aurevita</div>
            <p className="text-bone-200 text-sm max-w-sm leading-relaxed">
              Plataforma de gestão para redes de distribuição —
              pedidos, produtos e equipe comercial em um só lugar.
            </p>
          </div>
          <div>
            <h4 className="text-bone-50 font-sans font-medium text-sm uppercase tracking-widest mb-4">Siga</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 border border-moss-700 rounded-full hover:bg-moss-800"><Instagram size={16} /></a>
              <a href="#" className="p-2 border border-moss-700 rounded-full hover:bg-moss-800"><Facebook size={16} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-moss-800">
          <div className="max-w-7xl mx-auto px-6 py-5 text-xs text-bone-200 flex justify-between flex-wrap gap-2 items-center">
            <span>© 2026 Aurevita. Todos os direitos reservados.</span>
            {isAuthenticated && isAdmin && (
              <Link to="/admin" className="font-mono text-bone-200 hover:text-bone-50">painel admin →</Link>
            )}
            {isAuthenticated && isAppUser && (
              <Link to="/app" className="font-mono text-bone-200 hover:text-bone-50">meu painel →</Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
