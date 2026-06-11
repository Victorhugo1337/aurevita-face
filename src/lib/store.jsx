import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { getSavedUser, loginApi, logoutApi, fetchMe } from './auth'
import { getToken } from './api'
import { isAdmin, isAppUser } from './roles'

const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(() => getSavedUser())
  const [authLoading, setAuthLoading] = useState(false)
  const [booting, setBooting] = useState(Boolean(getToken()))

  const isAuthenticated = Boolean(user && getToken())

  useEffect(() => {
    if (!getToken()) {
      setBooting(false)
      return
    }
    fetchMe()
      .then(setUser)
      .catch(() => {
        logoutApi()
        setUser(null)
      })
      .finally(() => setBooting(false))
  }, [])

  const add = (product, qty = 1) => {
    setCart((c) => {
      const found = c.find((i) => i.product.id === product.id)
      if (found) return c.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + qty } : i)
      return [...c, { product, qty }]
    })
  }
  const remove = (id) => setCart((c) => c.filter((i) => i.product.id !== id))
  const setQty = (id, qty) => setCart((c) =>
    c.map((i) => i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i)
  )
  const clear = () => setCart([])

  const total = useMemo(
    () => cart.reduce((s, i) => s + i.product.price * i.qty, 0),
    [cart]
  )
  const count = useMemo(
    () => cart.reduce((s, i) => s + i.qty, 0),
    [cart]
  )

  const login = async (email, password) => {
    setAuthLoading(true)
    try {
      const logged = await loginApi(email, password)
      setUser(logged)
      return logged
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = () => {
    logoutApi()
    setUser(null)
    clear()
  }

  const isAdminUser = isAdmin(user?.role)
  const isAppUserRole = isAppUser(user?.role)

  return (
    <StoreCtx.Provider value={{
      cart, add, remove, setQty, clear, total, count,
      user, login, logout, authLoading, booting, isAuthenticated,
      isAdmin: isAdminUser, isAppUser: isAppUserRole,
    }}>
      {children}
    </StoreCtx.Provider>
  )
}

export const useStore = () => useContext(StoreCtx)
