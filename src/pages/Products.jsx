import React, { useState, useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import { products, categories } from '../utils/products'
import styles from './Products.module.css'

export default function Products() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')

  const filtered = useMemo(() => {
    let list = filter === 'all' ? products : products.filter(p => p.cat === filter)
    if (search.trim()) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'priceLow') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'priceHigh') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [filter, search, sort])

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>All Products</h1>
            <p className={styles.sub}>{filtered.length} products found</p>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            {search && <button className={styles.clearBtn} onClick={() => setSearch('')}>✕</button>}
          </div>

          <select className={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="default">Sort: Default</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <div className={styles.filters}>
          {categories.map(cat => (
            <button key={cat} className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`} onClick={() => setFilter(cat)}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>😕</div>
            <h3>No products found</h3>
            <p>Try a different search or filter</p>
            <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => { setSearch(''); setFilter('all') }}>Clear Filters</button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
