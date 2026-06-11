import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export function PanelShell({
  subtitle,
  navItems,
  footer,
  extraNav,
  children,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const sidebar = (
    <>
      <div className="p-5 lg:p-6 border-b border-moss-800">
        <div className="font-display text-2xl text-bone-50 leading-none">Aurevita</div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-moss-400 mt-1">
          {subtitle}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMenuOpen(false)}
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
        {extraNav}
      </nav>

      {footer && (
        <div className="p-4 border-t border-moss-800 shrink-0">
          {footer}
        </div>
      )}
    </>
  )

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-bone-100">
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between gap-3 px-4 py-3 bg-moss-950 text-bone-50 border-b border-moss-800">
        <div>
          <div className="font-display text-xl leading-none">Aurevita</div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-moss-400 mt-0.5">
            {subtitle}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="p-2 rounded-lg border border-moss-700 hover:bg-moss-900"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-40 bg-moss-950/60"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-[min(100%,280px)] bg-moss-950 text-bone-100 flex flex-col transform transition-transform duration-200 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebar}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-moss-950 text-bone-100 flex-col shrink-0">
        {sidebar}
      </aside>

      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
