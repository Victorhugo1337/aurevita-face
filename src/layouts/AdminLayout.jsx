import { Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, ArrowLeftRight } from 'lucide-react'
import { useStore } from '../lib/store'
import { ApiDocsLink } from '../components/ApiDocsLink'
import { PanelShell } from '../components/PanelShell'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/movimentacoes', icon: ArrowLeftRight, label: 'Movimentações' },
  { to: '/admin/produtos', icon: Package, label: 'Produtos' },
  { to: '/admin/pedidos', icon: ShoppingCart, label: 'Pedidos' },
  { to: '/admin/clientes', icon: Users, label: 'Clientes' },
  { to: '/admin/config', icon: Settings, label: 'Configurações' },
]

export function AdminLayout() {
  const { user, logout } = useStore()
  const nav = useNavigate()

  return (
    <PanelShell
      subtitle="admin painel"
      navItems={navItems}
      extraNav={
        <ApiDocsLink
          label="Docs API"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-bone-200 hover:bg-moss-900 hover:text-bone-50 transition mt-2"
        />
      }
      footer={
        <>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-clay-500 flex items-center justify-center font-medium text-bone-50 shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="text-xs min-w-0">
              <div className="text-bone-50 font-medium truncate">{user?.name || 'Admin'}</div>
              <div className="text-moss-400 truncate">{user?.email || 'admin@aurevita.com'}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { logout(); nav('/login') }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-bone-200 border border-moss-800 rounded-lg hover:bg-moss-900"
          >
            <LogOut size={14} /> Sair
          </button>
        </>
      }
    >
      <Outlet />
    </PanelShell>
  )
}
