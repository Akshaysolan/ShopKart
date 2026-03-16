import React from 'react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const { addToCart, cart } = useCart()
  const { showToast } = useToast()
  const inCart = cart.find(c => c.id === product.id)

  const handleAdd = () => {
    addToCart(product)
    showToast(`${product.name} added to cart!`, 'success')
  }

  const discount = Math.round((1 - product.price / product.orig) * 100)
  const fmt = n => '₹' + n.toLocaleString('en-IN')

  return (
    <div className={styles.card}>
      <div className={styles.imgBox}>
        <span className={styles.emoji}>{product.emoji}</span>
        <span className={styles.badge}>{product.badge}</span>
        {discount > 0 && <span className={styles.discountBadge}>−{discount}%</span>}
      </div>
      <div className={styles.body}>
        <div className={styles.rating}>
          {'⭐'.repeat(Math.round(product.rating))} <span className={styles.ratingNum}>{product.rating} ({product.reviews.toLocaleString()})</span>
        </div>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.desc}>{product.desc}</p>
        <div className={styles.footer}>
          <div>
            <div className={styles.price}>{fmt(product.price)}</div>
            <div className={styles.orig}>{fmt(product.orig)}</div>
          </div>
          <button
            className={`${styles.addBtn} ${inCart ? styles.inCart : ''}`}
            onClick={handleAdd}
          >
            {inCart ? `✓ ${inCart.qty}` : '+'}
          </button>
        </div>
      </div>
    </div>
  )
}
