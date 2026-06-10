import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingCart, Package, LogOut } from 'lucide-react'
import { useStore } from '../lib/store'
import { getRoleLabel } from '../lib/roles'
import { ApiDocsLink } from '../components/ApiDocsLink'

const navItems = [
  { to: '/app',            icon: LayoutDashboard, label: 'Minha operação', end: true },
  { to: '/app/pedidos',    icon: ShoppingCart,    label: 'Meus pedidos' },
  { to: '/app/catalogo',   icon: Package,         label: 'Catálogo' },
]

export function AppLayout() {
  const { user, logout } = useStore()
  const nav = useNavigate()

  return (
    <div className="min-h-screen flex bg-bone-100">
      <aside className="w-64 bg-moss-950 text-bone-100 flex flex-col">
        <div className="p-6 border-b border-moss-800">
          <div className="font-display text-2xl text-bone-50 leading-none">Aurevita</div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-moss-400 mt-1">
            portal do parceiro
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-moss-800 text-bone-50'
                    : 'text-bone-200 hover:bg-moss-900 hover:text-bone-50'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
          <ApiDocsLink
            label="Docs API"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-bone-200 hover:bg-moss-900 hover:text-bone-50 transition mt-2"
          />
        </nav>

        <div className="p-4 border-t border-moss-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-clay-500 flex items-center justify-center font-medium text-bone-50">
              {user?.name?.[0]?.toUpperCase() || 'P'}
            </div>
            <div className="text-xs min-w-0">
              <div className="text-bone-50 font-medium truncate">{user?.name}</div>
              <div className="text-moss-400 truncate">{getRoleLabel(user?.role)}</div>
            </div>
          </div>
          <button
            onClick={() => { logout(); nav('/login') }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-bone-200 border border-moss-800 rounded-lg hover:bg-moss-900"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
