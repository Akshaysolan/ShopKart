import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import styles from './CheckoutModal.module.css'

const UPI_APPS = [
  { name: 'PhonePe', icon: '🟢', handle: '@ybl' },
  { name: 'GPay', icon: '🔵', handle: '@okaxis' },
  { name: 'Paytm', icon: '🟣', handle: '@paytm' },
  { name: 'BHIM', icon: '🟠', handle: '@upi' },
]

export default function CheckoutModal({ onClose }) {
  const { cart, total, subtotal, discount, clearCart } = useCart()
  const { user, saveOrder } = useAuth()
  const { showToast } = useToast()

  const [step, setStep] = useState('form') // form | processing | success
  const [payMode, setPayMode] = useState('upi')
  const [selectedApp, setSelectedApp] = useState(0)
  const [upiId, setUpiId] = useState('')
  const [upiVerified, setUpiVerified] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [addr, setAddr] = useState({ name: user?.name || '', phone: '', address: '', city: '', pincode: '' })
  const [errors, setErrors] = useState({})
  const [orderId, setOrderId] = useState('')
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' })

  const fmt = n => '₹' + n.toLocaleString('en-IN')

  const validate = () => {
    const e = {}
    if (!addr.name.trim()) e.name = 'Name is required'
    if (!addr.phone.trim() || !/^\d{10}$/.test(addr.phone)) e.phone = 'Valid 10-digit phone required'
    if (!addr.address.trim()) e.address = 'Address is required'
    if (!addr.city.trim()) e.city = 'City is required'
    if (!addr.pincode.trim() || !/^\d{6}$/.test(addr.pincode)) e.pincode = 'Valid 6-digit pincode required'
    if (payMode === 'upi' && upiId && !upiVerified) e.upi = 'Please verify your UPI ID'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const verifyUPI = () => {
    if (!upiId.trim()) return
    setVerifying(true)
    setTimeout(() => {
      setVerifying(false)
      setUpiVerified(true)
      showToast('UPI ID verified!', 'success')
    }, 1200)
  }

  const handlePay = () => {
    if (!validate()) return
    setStep('processing')
    const id = 'SKT' + Date.now().toString().slice(-8)
    setOrderId(id)
    setTimeout(() => {
      const order = {
        id,
        items: cart,
        total,
        subtotal,
        discount,
        address: addr,
        paymentMethod: payMode === 'upi' ? `UPI (${UPI_APPS[selectedApp].name})` : payMode === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery',
        date: new Date().toISOString(),
        status: 'Confirmed'
      }
      saveOrder(order)
      clearCart()
      setStep('success')
    }, 2800)
  }

  const formatCardNumber = v => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = v => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 2 ? d.slice(0,2) + ' / ' + d.slice(2) : d }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>
            {step === 'success' ? '✅ Order Confirmed!' : step === 'processing' ? '⏳ Processing...' : '💳 Secure Checkout'}
          </h2>
          {step === 'form' && <button className={styles.closeBtn} onClick={onClose}>✕</button>}
        </div>

        {/* Processing */}
        {step === 'processing' && (
          <div className={styles.centerScreen}>
            <div className="spinner" style={{ marginBottom: '1.5rem' }} />
            <h3 className={styles.processingTitle}>Processing your payment</h3>
            <p className={styles.processingText}>Please do not close this window…</p>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className={styles.centerScreen}>
            <div className={styles.successIcon}>✅</div>
            <h3 className={styles.successTitle}>Payment Successful!</h3>
            <p className={styles.successText}>Your order has been placed successfully.</p>
            <div className={styles.orderIdBox}>Order ID: {orderId}</div>
            <p className={styles.successText} style={{ fontSize: '0.82rem', marginTop: '0.3rem' }}>
              A confirmation will be sent to {user?.email}
            </p>
            <button className="btn btn-dark" style={{ marginTop: '1.5rem', padding: '0.75rem 2rem' }} onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        )}

        {/* Form */}
        {step === 'form' && (
          <div className={styles.body}>

            {/* Order summary */}
            <p className={styles.sectionLabel}>Order Summary</p>
            <div className={styles.summary}>
              <div className={styles.summaryItems}>
                {cart.map(c => (
                  <div key={c.id} className={styles.summaryItem}>
                    <span>{c.emoji} {c.name} × {c.qty}</span>
                    <span>{fmt(c.price * c.qty)}</span>
                  </div>
                ))}
              </div>
              <div className={styles.summaryRow}><span>Discount 10%</span><span style={{ color: 'var(--accent)' }}>−{fmt(discount)}</span></div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}><span>Total Payable</span><span>{fmt(total)}</span></div>
            </div>

            {/* Delivery */}
            <p className={styles.sectionLabel}>Delivery Address</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.8rem' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input className={errors.name ? 'error' : ''} value={addr.name} onChange={e => setAddr({ ...addr, name: e.target.value })} placeholder="Ravi Kumar" />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input className={errors.phone ? 'error' : ''} value={addr.phone} onChange={e => setAddr({ ...addr, phone: e.target.value.replace(/\D/g,'').slice(0,10) })} placeholder="9876543210" />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>
            </div>
            <div className="form-group">
              <label>Street Address</label>
              <input className={errors.address ? 'error' : ''} value={addr.address} onChange={e => setAddr({ ...addr, address: e.target.value })} placeholder="123 MG Road, Koregaon Park" />
              {errors.address && <div className="form-error">{errors.address}</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.8rem' }}>
              <div className="form-group">
                <label>City</label>
                <input className={errors.city ? 'error' : ''} value={addr.city} onChange={e => setAddr({ ...addr, city: e.target.value })} placeholder="Pune" />
                {errors.city && <div className="form-error">{errors.city}</div>}
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input className={errors.pincode ? 'error' : ''} value={addr.pincode} onChange={e => setAddr({ ...addr, pincode: e.target.value.replace(/\D/g,'').slice(0,6) })} placeholder="411001" />
                {errors.pincode && <div className="form-error">{errors.pincode}</div>}
              </div>
            </div>

            {/* Payment Method */}
            <p className={styles.sectionLabel}>Payment Method</p>
            <div className={styles.payTabs}>
              {[['upi','📱','UPI'],['card','💳','Card'],['cod','💵','COD']].map(([mode, icon, label]) => (
                <div key={mode} className={`${styles.payTab} ${payMode === mode ? styles.active : ''}`} onClick={() => setPayMode(mode)}>
                  <span className={styles.tabIcon}>{icon}</span>
                  <span className={styles.tabLabel}>{label}</span>
                </div>
              ))}
            </div>

            {/* UPI Panel */}
            {payMode === 'upi' && (
              <div className={styles.panel}>
                <p className={styles.panelLabel}>Select App</p>
                <div className={styles.upiApps}>
                  {UPI_APPS.map((app, i) => (
                    <div key={i} className={`${styles.upiApp} ${selectedApp === i ? styles.selected : ''}`} onClick={() => setSelectedApp(i)}>
                      <span className={styles.appIcon}>{app.icon}</span>
                      <span className={styles.appName}>{app.name}</span>
                    </div>
                  ))}
                </div>
                <p className={styles.panelLabel} style={{ marginTop: '0.8rem' }}>Or enter UPI ID manually</p>
                <div className={styles.upiRow}>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => { setUpiId(e.target.value); setUpiVerified(false) }}
                    placeholder={`yourname${UPI_APPS[selectedApp].handle}`}
                    style={{ flex: 1, padding: '0.7rem 1rem', border: `1.5px solid ${errors.upi ? 'var(--danger)' : 'var(--border)'}`, borderRadius: '10px', fontSize: '0.92rem', outline: 'none' }}
                  />
                  <button className={`${styles.verifyBtn} ${upiVerified ? styles.verified : ''}`} onClick={verifyUPI} disabled={verifying || upiVerified || !upiId}>
                    {verifying ? '...' : upiVerified ? '✓ Verified' : 'Verify'}
                  </button>
                </div>
                {errors.upi && <div className="form-error">{errors.upi}</div>}
                <button className="btn btn-upi btn-block" style={{ marginTop: '1rem', padding: '0.9rem' }} onClick={handlePay}>
                  Pay {fmt(total)} via {UPI_APPS[selectedApp].name}
                </button>
              </div>
            )}

            {/* Card Panel */}
            {payMode === 'card' && (
              <div className={styles.panel}>
                <div className="form-group">
                  <label>Card Number</label>
                  <input value={cardData.number} onChange={e => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })} placeholder="4111 1111 1111 1111" maxLength={19} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.8rem' }}>
                  <div className="form-group">
                    <label>Expiry</label>
                    <input value={cardData.expiry} onChange={e => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })} placeholder="MM / YY" maxLength={7} />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="password" value={cardData.cvv} onChange={e => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g,'').slice(0,3) })} placeholder="•••" maxLength={3} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Name on Card</label>
                  <input value={cardData.name} onChange={e => setCardData({ ...cardData, name: e.target.value.toUpperCase() })} placeholder="RAVI KUMAR" />
                </div>
                <button className="btn btn-dark btn-block" style={{ padding: '0.9rem' }} onClick={handlePay}>
                  🔒 Pay {fmt(total)} Securely
                </button>
              </div>
            )}

            {/* COD Panel */}
            {payMode === 'cod' && (
              <div className={styles.panel}>
                <div className={styles.codBox}>
                  <span style={{ fontSize: '1.4rem' }}>📦</span>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>Cash on Delivery</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Pay <strong style={{ color: 'var(--text)' }}>{fmt(total)}</strong> when your order arrives. Available for all pin codes.</div>
                  </div>
                </div>
                <button className="btn btn-success btn-block" style={{ marginTop: '1rem', padding: '0.9rem' }} onClick={handlePay}>
                  Confirm COD Order — {fmt(total)}
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}
