import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('shopkart_user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('shopkart_users') || '[]')
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' }
    }
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production: hash this with bcrypt
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      createdAt: new Date().toISOString(),
      orders: []
    }
    users.push(newUser)
    localStorage.setItem('shopkart_users', JSON.stringify(users))
    const { password: _, ...safeUser } = newUser
    setUser(safeUser)
    localStorage.setItem('shopkart_user', JSON.stringify(safeUser))
    return { success: true }
  }

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('shopkart_users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) return { success: false, error: 'Invalid email or password' }
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem('shopkart_user', JSON.stringify(safeUser))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('shopkart_user')
  }

  const saveOrder = (order) => {
    const users = JSON.parse(localStorage.getItem('shopkart_users') || '[]')
    const idx = users.findIndex(u => u.id === user.id)
    if (idx === -1) return
    users[idx].orders = users[idx].orders || []
    users[idx].orders.unshift(order)
    localStorage.setItem('shopkart_users', JSON.stringify(users))
    const updated = { ...user, orders: users[idx].orders }
    setUser(updated)
    localStorage.setItem('shopkart_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, saveOrder }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
