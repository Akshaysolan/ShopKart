import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import styles from './Profile.module.css'

export default function Profile() {
  const { user, logout } = useAuth()
  const orders = user?.orders || []
  const totalSpent = orders.reduce((s, o) => s + o.total, 0)
  const fmt = n => '₹' + n.toLocaleString('en-IN')
  const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.grid}>

          {/* Profile Card */}
          <div className={styles.profileCard}>
            <div className={styles.avatarLarge}>{user?.avatar}</div>
            <h2 className={styles.name}>{user?.name}</h2>
            <p className={styles.email}>{user?.email}</p>
            <p className={styles.joined}>Member since {fmtDate(user?.createdAt)}</p>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <strong>{orders.length}</strong>
                <span>Orders</span>
              </div>
              <div className={styles.statDiv} />
              <div className={styles.stat}>
                <strong>{fmt(totalSpent)}</strong>
                <span>Total Spent</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Link to="/orders" className="btn btn-outline btn-block" style={{ borderRadius: '10px', marginBottom: '0.6rem' }}>📦 My Orders</Link>
              <button className={`btn btn-block ${styles.logoutBtn}`} style={{ borderRadius: '10px' }} onClick={logout}>🚪 Sign Out</button>
            </div>
          </div>

          {/* Recent Orders */}
          <div className={styles.main}>
            <h2 className={styles.sectionTitle}>Recent Orders</h2>
            {orders.length === 0 ? (
              <div className={styles.emptyOrders}>
                <p>You haven't placed any orders yet.</p>
                <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Start Shopping →</Link>
              </div>
            ) : orders.slice(0, 3).map(order => (
              <div key={order.id} className={styles.miniOrder}>
                <div className={styles.miniOrderHeader}>
                  <span className={styles.miniOrderId}>#{order.id}</span>
                  <span className={styles.miniOrderTotal}>{fmt(order.total)}</span>
                </div>
                <div className={styles.miniOrderItems}>
                  {order.items.map(item => item.emoji).join(' ')} — {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </div>
                <div className={styles.miniOrderMeta}>
                  {new Date(order.date).toLocaleDateString('en-IN')} · {order.paymentMethod}
                </div>
              </div>
            ))}
            {orders.length > 3 && (
              <Link to="/orders" className={styles.viewAll}>View all {orders.length} orders →</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
