import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import styles from './Orders.module.css'

export default function Orders() {
  const { user } = useAuth()
  const orders = user?.orders || []

  const fmt = n => '₹' + n.toLocaleString('en-IN')
  const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>My Orders</h1>
        <p className={styles.sub}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📦</div>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '1.2rem', padding: '0.75rem 1.8rem' }}>
              Browse Products →
            </Link>
          </div>
        ) : (
          <div className={styles.list}>
            {orders.map(order => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <div className={styles.orderId}>#{order.id}</div>
                    <div className={styles.orderDate}>{fmtDate(order.date)}</div>
                  </div>
                  <div className={styles.orderRight}>
                    <span className={styles.statusBadge}>✅ {order.status}</span>
                    <div className={styles.orderTotal}>{fmt(order.total)}</div>
                  </div>
                </div>

                <div className={styles.orderItems}>
                  {order.items.map(item => (
                    <div key={item.id} className={styles.orderItem}>
                      <span className={styles.itemEmoji}>{item.emoji}</span>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemQty}>× {item.qty}</span>
                      <span className={styles.itemPrice}>{fmt(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <div className={styles.orderMeta}>
                    <span>📱 {order.paymentMethod}</span>
                    <span>📍 {order.address.city}, {order.address.pincode}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
