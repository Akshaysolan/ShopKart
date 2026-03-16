import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { products, categories } from '../utils/products'
import styles from './Home.module.css'

const FEATURES = [
  { icon: '🚀', title: 'Same-Day Delivery', desc: 'Available in 50+ cities across India' },
  { icon: '🔒', title: 'Secure Payments', desc: 'UPI, Cards & COD — all encrypted' },
  { icon: '↩️', title: '30-Day Returns', desc: 'Hassle-free return policy' },
  { icon: '💬', title: '24/7 Support', desc: 'Chat, call or email anytime' },
]

export default function Home() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? products.slice(0, 8) : products.filter(p => p.cat === filter).slice(0, 8)

  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroPill}>🇮🇳 Made for India</span>
          <h1 className={styles.heroTitle}>
            Shop <em className={styles.heroEm}>Smarter</em>,<br />Pay with UPI
          </h1>
          <p className={styles.heroSub}>
            Discover top products and checkout in seconds with India's favourite payment method.
          </p>
          <div className={styles.heroBtns}>
            <Link to="/products" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              Shop Now →
            </Link>
            <a href="#features" className="btn btn-outline" style={{ padding: '0.85rem 2rem', fontSize: '1rem', color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.3)' }}>
              Learn More
            </a>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}><strong>50K+</strong><span>Happy Customers</span></div>
            <div className={styles.heroStatDiv} />
            <div className={styles.heroStat}><strong>1200+</strong><span>Products</span></div>
            <div className={styles.heroStatDiv} />
            <div className={styles.heroStat}><strong>4.8★</strong><span>App Rating</span></div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.productsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Featured Products</h2>
              <p className={styles.sectionSub}>Curated picks just for you</p>
            </div>
            <Link to="/products" className="btn btn-outline" style={{ borderRadius: '10px', padding: '0.5rem 1.2rem', fontSize: '0.88rem' }}>
              View All →
            </Link>
          </div>

          <div className={styles.filters}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features} id="features">
        <div className="container">
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPI Banner */}
      <section className={styles.upiBanner}>
        <div className="container">
          <div className={styles.upiInner}>
            <div>
              <h2 className={styles.upiTitle}>Pay Instantly with UPI</h2>
              <p className={styles.upiDesc}>Works with PhonePe, GPay, Paytm, BHIM & all UPI apps. Zero transaction fees.</p>
            </div>
            <div className={styles.upiApps}>
              {['🟢 PhonePe', '🔵 GPay', '🟣 Paytm', '🟠 BHIM'].map((app, i) => (
                <span key={i} className={styles.upiChip}>{app}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerTop}>
            <div>
              <div className={styles.footerLogo}>Shop<span>Kart</span></div>
              <p className={styles.footerTagline}>Shop smarter, pay with UPI.</p>
            </div>
            <div className={styles.footerLinks}>
              <div className={styles.footerCol}>
                <h4>Shop</h4>
                <Link to="/products">All Products</Link>
                <Link to="/products">Electronics</Link>
                <Link to="/products">Fashion</Link>
              </div>
              <div className={styles.footerCol}>
                <h4>Account</h4>
                <Link to="/login">Login</Link>
                <Link to="/register">Sign Up</Link>
                <Link to="/orders">My Orders</Link>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2025 ShopKart. Made with ❤️ in India</span>
            <span>UPI Payments powered by NPCI</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
