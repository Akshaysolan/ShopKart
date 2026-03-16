import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const { user } = useAuth()

  // Load cart from localStorage per user
  useEffect(() => {
    const key = user ? `shopkart_cart_${user.id}` : 'shopkart_cart_guest'
    const saved = localStorage.getItem(key)
    setCart(saved ? JSON.parse(saved) : [])
  }, [user])

  const saveCart = (newCart) => {
    const key = user ? `shopkart_cart_${user.id}` : 'shopkart_cart_guest'
    localStorage.setItem(key, JSON.stringify(newCart))
    setCart(newCart)
  }

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === product.id)
      const updated = existing
        ? prev.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c)
        : [...prev, { ...product, qty: 1 }]
      const key = user ? `shopkart_cart_${user.id}` : 'shopkart_cart_guest'
      localStorage.setItem(key, JSON.stringify(updated))
      return updated
    })
  }

  const removeFromCart = (id) => {
    const updated = cart.filter(c => c.id !== id)
    saveCart(updated)
  }

  const changeQty = (id, delta) => {
    const updated = cart
      .map(c => c.id === id ? { ...c, qty: c.qty + delta } : c)
      .filter(c => c.qty > 0)
    saveCart(updated)
  }

  const clearCart = () => saveCart([])

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const discount = Math.round(subtotal * 0.10)
  const total = subtotal - discount
  const itemCount = cart.reduce((s, c) => s + c.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, changeQty, clearCart, subtotal, discount, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
