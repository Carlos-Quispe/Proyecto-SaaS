import { useState } from 'react';
import { CATEGORIES } from '../services/productService';
import ProductCard from './ProductCard';
import './ProductGrid.css';

export default function ProductGrid({ products, loading }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section className="product-grid-section">
      {/* ─── Toolbar ─── */}
      <div className="product-grid__toolbar">
        <div className="product-grid__search-wrap">
          <span className="product-grid__search-icon">🔍</span>
          <input
            id="product-search"
            type="text"
            className="product-grid__search"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="product-grid__search-clear"
              onClick={() => setSearchTerm('')}
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </div>

        <div className="product-grid__categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              id={`category-${cat.key}`}
              className={`product-grid__cat-btn ${
                activeCategory === cat.key ? 'product-grid__cat-btn--active' : ''
              }`}
              onClick={() => setActiveCategory(cat.key)}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Results info ─── */}
      <div className="product-grid__info">
        <span>
          {loading
            ? 'Cargando...'
            : `${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`}
        </span>
        {activeCategory !== 'all' && (
          <button
            className="product-grid__clear-filter"
            onClick={() => setActiveCategory('all')}
          >
            ✕ Limpiar filtro
          </button>
        )}
      </div>

      {/* ─── Grid ─── */}
      {loading ? (
        <div className="product-grid__loading">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="product-card-skeleton">
              <div className="pcs__img" />
              <div className="pcs__body">
                <div className="pcs__line pcs__line--sm" />
                <div className="pcs__line pcs__line--lg" />
                <div className="pcs__line pcs__line--md" />
                <div className="pcs__line pcs__line--md" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="product-grid">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="product-grid__empty">
          <span className="product-grid__empty-icon">🔍</span>
          <h3>No se encontraron productos</h3>
          <p>Intenta con otra búsqueda o categoría</p>
        </div>
      )}
    </section>
  );
}
