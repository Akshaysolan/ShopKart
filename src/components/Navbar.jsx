import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import CartSidebar from './CartSidebar'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>Shop<span>Kart</span></Link>

          <ul className={styles.links}>
            <li><Link to="/" className={location.pathname === '/' ? styles.active : ''}>Home</Link></li>
            <li><Link to="/products" className={location.pathname === '/products' ? styles.active : ''}>Products</Link></li>
            {user && <li><Link to="/orders" className={location.pathname === '/orders' ? styles.active : ''}>My Orders</Link></li>}
          </ul>

          <div className={styles.right}>
            <button className={styles.cartBtn} onClick={() => setCartOpen(true)}>
              🛒 <span className={styles.badge}>{itemCount}</span>
            </button>

            {user ? (
              <div className={styles.userMenu}>
                <button className={styles.avatarBtn} onClick={() => setMenuOpen(!menuOpen)}>
                  <span className={styles.avatar}>{user.avatar}</span>
                  <span className={styles.userName}>{user.name.split(' ')[0]}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
                </button>
                {menuOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownName}>{user.name}</div>
                      <div className={styles.dropdownEmail}>{user.email}</div>
                    </div>
                    <Link to="/profile" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>👤 Profile</Link>
                    <Link to="/orders" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>📦 My Orders</Link>
                    <div className={styles.dropdownDivider} />
                    <button className={styles.dropdownItem + ' ' + styles.logoutItem} onClick={handleLogout}>🚪 Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.authBtns}>
                <Link to="/login" className="btn btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.88rem', borderRadius: '8px' }}>Login</Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.88rem', borderRadius: '8px' }}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
