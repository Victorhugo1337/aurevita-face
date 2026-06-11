import { Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingCart, Package, LogOut, ArrowLeftRight, Settings,
} from 'lucide-react'
import { useStore } from '../lib/store'
import { getRoleLabel } from '../lib/roles'
import { getAppNavItems } from '../lib/permissions'
import { PanelShell } from '../components/PanelShell'

const ICONS = {
  dashboard: LayoutDashboard,
  orders: ShoppingCart,
  catalog: Package,
  movements: ArrowLeftRight,
  config: Settings,
}

export function AppLayout() {
  const { user, logout } = useStore()
  const nav = useNavigate()
  const navItems = getAppNavItems(user?.role).map(({ to, icon, label, end }) => ({
    to,
    label,
    end,
    icon: ICONS[icon] || Package,
  }))

  return (
    <PanelShell
      subtitle="portal do parceiro"
      navItems={navItems}
      footer={
        <>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-clay-500 flex items-center justify-center font-medium text-bone-50 shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'P'}
            </div>
            <div className="text-xs min-w-0">
              <div className="text-bone-50 font-medium truncate">{user?.name}</div>
              <div className="text-moss-400 truncate">{getRoleLabel(user?.role)}</div>
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
