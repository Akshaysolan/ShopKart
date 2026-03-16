import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import CheckoutModal from './CheckoutModal'
import styles from './CartSidebar.module.css'

export default function CartSidebar({ open, onClose }) {
  const { cart, removeFromCart, changeQty, subtotal, discount, total, itemCount } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const handleCheckout = () => {
    if (!user) {
      onClose()
      navigate('/login')
      return
    }
    setCheckoutOpen(true)
  }

  const fmt = n => '₹' + n.toLocaleString('en-IN')

  return (
    <>
      <div className={`${styles.overlay} ${open ? styles.open : ''}`} onClick={onClose} />
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>My Cart 🛒 {itemCount > 0 && <span className={styles.itemBadge}>{itemCount}</span>}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.items}>
          {cart.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🛒</div>
              <p>Your cart is empty</p>
              <small>Add products to get started!</small>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemImg}>{item.emoji}</div>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{item.name}</div>
                <div className={styles.itemPrice}>{fmt(item.price * item.qty)}</div>
                <div className={styles.qtyRow}>
                  <button className={styles.qtyBtn} onClick={() => changeQty(item.id, -1)}>−</button>
                  <span className={styles.qty}>{item.qty}</span>
                  <button className={styles.qtyBtn} onClick={() => changeQty(item.id, 1)}>+</button>
                </div>
              </div>
              <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>🗑</button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className={styles.totalRow}><span>Delivery</span><span style={{ color: 'var(--success)' }}>FREE</span></div>
            <div className={styles.totalRow}><span>Discount (10%)</span><span style={{ color: 'var(--accent)' }}>−{fmt(discount)}</span></div>
            <div className={`${styles.totalRow} ${styles.grand}`}><span>Total</span><span>{fmt(total)}</span></div>
            <button className="btn btn-dark btn-block" style={{ marginTop: '1rem', borderRadius: '12px', padding: '0.85rem' }} onClick={handleCheckout}>
              {user ? 'Proceed to Checkout →' : '🔒 Login to Checkout'}
            </button>
          </div>
        )}
      </aside>

      {checkoutOpen && <CheckoutModal onClose={() => { setCheckoutOpen(false); onClose() }} />}
    </>
  )
}
