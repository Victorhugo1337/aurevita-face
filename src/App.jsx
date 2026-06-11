import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { StoreProvider, useStore } from './lib/store'
import { StoreLayout } from './layouts/StoreLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { AppLayout } from './layouts/AppLayout'
import { isAdmin, isAppUser, getHomeRoute } from './lib/roles'
import { canAccessApp } from './lib/permissions'

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
import { AdminMovements } from './pages/shared/MovementsPage'

import { AppDashboard } from './pages/app/AppDashboard'
import { AppOrders }    from './pages/app/AppOrders'
import { AppMovements } from './pages/shared/MovementsPage'
import { AppSettings } from './pages/admin/AdminPlaceholders'

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

function AppFeatureRoute({ path, children }) {
  const { user } = useStore()
  if (!canAccessApp(user?.role, path)) {
    return <Navigate to={getHomeRoute(user?.role)} replace />
  }
  return children
}

function LegacyProductRedirect() {
  const { id } = useParams()
  return <Navigate to={`/app/produto/${id}`} replace />
}

function CatalogRoute() {
  return <Catalog productBasePath="/app/produto" />
}

function ProductDetailRoute() {
  return <ProductDetail catalogPath="/app/catalogo" />
}

export default function App() {
  return (
    <StoreProvider>
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route path="/login"    element={<Login />} />
        <Route path="/cadastro" element={<Register />} />

        <Route element={<RequireApp><AppLayout /></RequireApp>}>
          <Route path="/app" element={
            <AppFeatureRoute path="/app"><AppDashboard /></AppFeatureRoute>
          } />
          <Route path="/app/pedidos" element={
            <AppFeatureRoute path="/app/pedidos"><AppOrders /></AppFeatureRoute>
          } />
          <Route path="/app/catalogo" element={
            <AppFeatureRoute path="/app/catalogo"><CatalogRoute /></AppFeatureRoute>
          } />
          <Route path="/app/produto/:id" element={
            <AppFeatureRoute path="/app/catalogo"><ProductDetailRoute /></AppFeatureRoute>
          } />
          <Route path="/app/carrinho" element={
            <AppFeatureRoute path="/app/carrinho"><Cart catalogPath="/app/catalogo" /></AppFeatureRoute>
          } />
          <Route path="/app/movimentacoes" element={
            <AppFeatureRoute path="/app/movimentacoes"><AppMovements /></AppFeatureRoute>
          } />
          <Route path="/app/config" element={
            <AppFeatureRoute path="/app/config"><AppSettings /></AppFeatureRoute>
          } />
        </Route>

        <Route element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route path="/admin"              element={<Dashboard />} />
          <Route path="/admin/movimentacoes" element={<AdminMovements />} />
          <Route path="/admin/produtos"     element={<AdminProducts />} />
          <Route path="/admin/pedidos"      element={<AdminOrders />} />
          <Route path="/admin/clientes"     element={<AdminCustomers />} />
          <Route path="/admin/config"        element={<AdminSettings />} />
        </Route>

        <Route path="/loja"        element={<Navigate to="/app/catalogo" replace />} />
        <Route path="/produto/:id" element={<LegacyProductRedirect />} />
        <Route path="/carrinho"    element={<Navigate to="/app/carrinho" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </StoreProvider>
  )
}
