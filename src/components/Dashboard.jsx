import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../context/TenantContext';
import { fetchProducts, fetchProductStats } from '../services/productService';
import TenantSwitcher from './TenantSwitcher';
import StatsCards from './StatsCards';
import ProductGrid from './ProductGrid';
import './Dashboard.css';

export default function Dashboard() {
  const { currentTenant } = useTenant();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, st] = await Promise.all([
        fetchProducts(currentTenant.id),
        fetchProductStats(currentTenant.id),
      ]);
      setProducts(prods);
      setStats(st);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [currentTenant.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="dashboard">
      {/* ─── Header ─── */}
      <header className="dashboard__header">
        <div className="dashboard__header-top">
          <div className="dashboard__brand">
            <div
              className="dashboard__logo"
              style={{ background: currentTenant.gradient }}
            >
              {currentTenant.avatar}
            </div>
            <div>
              <h1 className="dashboard__title">{currentTenant.name}</h1>
              <p className="dashboard__subtitle">{currentTenant.tagline}</p>
            </div>
          </div>
          <div className="dashboard__header-meta">
            <span className="dashboard__tenant-id">
              ID: {currentTenant.id}
            </span>
          </div>
        </div>

        {/* Tenant Switcher */}
        <TenantSwitcher />
      </header>

      {/* ─── Stats ─── */}
      <section className="dashboard__section" id="stats-section">
        <h2 className="dashboard__section-title">
          <span className="dashboard__section-icon">📊</span>
          Resumen del Inventario
        </h2>
        <StatsCards stats={stats} loading={loading} />
      </section>

      {/* ─── Products ─── */}
      <section className="dashboard__section" id="products-section">
        <h2 className="dashboard__section-title">
          <span className="dashboard__section-icon">🛍️</span>
          Catálogo de Productos
        </h2>
        <ProductGrid products={products} loading={loading} />
      </section>

      {/* ─── Footer ─── */}
      <footer className="dashboard__footer">
        <p>
          SaaS Stock Manager — Multi-Tenant Architecture Demo
        </p>
        <p className="dashboard__footer-sub">
          Cambia el perfil activo para ver cómo el catálogo se actualiza con datos diferentes
        </p>
      </footer>
    </div>
  );
}
