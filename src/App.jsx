import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { StoreProvider, useStore } from './lib/store'
import { StoreLayout } from './layouts/StoreLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { AppLayout } from './layouts/AppLayout'
import { isAdmin, isAppUser, getHomeRoute } from './lib/roles'

import { Home }          from './pages/store/Home'
import { Catalog }       from './pages/store/Catalog'
import { ProductDetail } from './pages/store/ProductDetail'
import { Cart }          from './pages/store/Cart'

import { Login }    from './pages/auth/Login'
import { Register } from './pages/auth/Register'

import { Dashboard }      from './pages/admin/Dashboard'
import { AdminProducts }  from './pages/admin/AdminProducts'
import { AdminOrders }    from './pages/admin/AdminOrders'
import { AdminCustomers, AdminSettings } from './pages/admin/AdminPlaceholders'

import { AppDashboard } from './pages/app/AppDashboard'
import { AppOrders }    from './pages/app/AppOrders'

function RequireAdmin({ children }) {
  const { user, isAuthenticated } = useStore()
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: '/admin' }} replace />
  if (!isAdmin(user?.role)) return <Navigate to={getHomeRoute(user?.role)} replace />
  return children
}

function RequireApp({ children }) {
  const { user, isAuthenticated } = useStore()
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: '/app' }} replace />
  if (isAdmin(user?.role)) return <Navigate to="/admin" replace />
  if (!isAppUser(user?.role)) return <Navigate to="/" replace />
  return children
}

function LegacyProductRedirect() {
  const { id } = useParams()
  return <Navigate to={`/app/produto/${id}`} replace />
}

export default function App() {
  return (
    <StoreProvider>
      <Routes>
        {/* Landing pública */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Auth (sem layout) */}
        <Route path="/login"    element={<Login />} />
        <Route path="/cadastro" element={<Register />} />

        {/* Portal parceiros B2B — SENIOR, DIRECTOR, DISTRIBUTOR, REPRESENTANT */}
        <Route element={<RequireApp><AppLayout /></RequireApp>}>
          <Route path="/app"              element={<AppDashboard />} />
          <Route path="/app/pedidos"      element={<AppOrders />} />
          <Route path="/app/catalogo"     element={<Catalog productBasePath="/app/produto" />} />
          <Route path="/app/produto/:id"  element={<ProductDetail catalogPath="/app/catalogo" />} />
          <Route path="/app/carrinho"     element={<Cart catalogPath="/app/catalogo" />} />
        </Route>

        {/* Painel interno Aurevita — ADMIN */}
        <Route element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route path="/admin"           element={<Dashboard />} />
          <Route path="/admin/produtos"  element={<AdminProducts />} />
          <Route path="/admin/pedidos"   element={<AdminOrders />} />
          <Route path="/admin/clientes"  element={<AdminCustomers />} />
          <Route path="/admin/config"    element={<AdminSettings />} />
        </Route>

        {/* Rotas legadas da loja — redirecionam para /app */}
        <Route path="/loja"           element={<Navigate to="/app/catalogo" replace />} />
        <Route path="/produto/:id"    element={<LegacyProductRedirect />} />
        <Route path="/carrinho"       element={<Navigate to="/app/carrinho" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </StoreProvider>
  )
}
