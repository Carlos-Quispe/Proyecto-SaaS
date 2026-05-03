import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { fetchProducts, fetchProductStats } from '../../services/productService';
import { fetchSales, fetchSaleStats, PAYMENT_METHODS, SALE_STATUS } from '../../services/salesService';
import { generatePdf } from '../../services/pdfService';
import './DashboardPage.css';
import './CrudPage.css';

/* ─── Helpers ─── */
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function generateSparkline(points = 20, min = 10, max = 90) {
  const data = [];
  let v = rand(40, 60);
  for (let i = 0; i < points; i++) {
    v += rand(-12, 12);
    v = Math.max(min, Math.min(max, v));
    data.push(v);
  }
  return data;
}

function generateBarData() {
  return [
    { label: 'Lun', value: rand(30, 95) },
    { label: 'Mar', value: rand(30, 95) },
    { label: 'Mié', value: rand(30, 95) },
    { label: 'Jue', value: rand(30, 95) },
    { label: 'Vie', value: rand(50, 100) },
    { label: 'Sáb', value: rand(60, 100) },
    { label: 'Dom', value: rand(20, 70) },
  ];
}

function generateHeatmapData(rows = 4, cols = 12) {
  const data = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(rand(0, 4)); // 0=none, 1=low, 2=mid, 3=high, 4=critical
    }
    data.push(row);
  }
  return data;
}

/* ═══════════════════════════════════════════════════
   MINI CHART COMPONENTS (Pure SVG/CSS)
   ═══════════════════════════════════════════════════ */

const SparklineChart = memo(function SparklineChart({ data, color = '#6366f1', height = 80, label, fillOpacity = 0.15 }) {
  const w = 280;
  const h = height;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * (h - 10) - 5,
  }));
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <div className="dash-chart-spark">
      {label && <span className="dash-chart-spark__label">{label}</span>}
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="dash-chart-spark__svg">
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={fillOpacity} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#grad-${color.replace('#', '')})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Last dot */}
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill={color} />
      </svg>
    </div>
  );
});

const BarChart = memo(function BarChart({ data, color = '#06b6d4' }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="dash-bar-chart">
      {data.map((d, i) => (
        <div 
          key={i} 
          className="dash-bar-chart__col"
          onClick={() => setActiveIndex(i === activeIndex ? null : i)}
        >
          {activeIndex === i && (
            <div className="dash-bar-chart__tooltip">
              <span className="dash-bar-chart__tooltip-lbl">{d.label}</span>
              <span className="dash-bar-chart__tooltip-val">{d.value} Ventas</span>
            </div>
          )}
          <div className="dash-bar-chart__bar-wrap">
            <div
              className={`dash-bar-chart__bar ${activeIndex === i ? 'dash-bar-chart__bar--active' : ''}`}
              style={{
                height: `${(d.value / max) * 100}%`,
                background: `linear-gradient(180deg, ${color} 0%, ${color}88 100%)`,
                animationDelay: `${i * 0.08}s`,
              }}
            />
          </div>
          <span className="dash-bar-chart__label">{d.label}</span>
        </div>
      ))}
    </div>
  );
});

const DonutChart = memo(function DonutChart({ value, max, color = '#10b981', label, size = 90 }) {
  const pct = Math.round((value / max) * 100);
  const circ = 2 * Math.PI * 36;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="dash-donut" style={{ width: size, height: size }}>
      <svg viewBox="0 0 80 80" className="dash-donut__svg">
        <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="40" cy="40" r="36" fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 40 40)"
          className="dash-donut__progress"
        />
      </svg>
      <div className="dash-donut__center">
        <span className="dash-donut__value" style={{ color }}>{pct}%</span>
        <span className="dash-donut__label">{label}</span>
      </div>
    </div>
  );
});

const HEATMAP_COLORS = [
  'rgba(255,255,255,0.04)',
  '#10b981',
  '#f59e0b',
  '#6366f1',
  '#ef4444',
];

const HeatmapGrid = memo(function HeatmapGrid({ data }) {
  return (
    <div className="dash-heatmap">
      {data.map((row, r) => (
        <div key={r} className="dash-heatmap__row">
          {row.map((cell, c) => (
            <div
              key={c}
              className="dash-heatmap__cell"
              style={{ background: HEATMAP_COLORS[cell], opacity: cell === 0 ? 0.4 : 0.85 }}
              title={`Nivel: ${cell}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

const ProgressRow = memo(function ProgressRow({ label, value, max, color = '#6366f1' }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="dash-progress-row">
      <div className="dash-progress-row__header">
        <span className="dash-progress-row__label">{label}</span>
        <span className="dash-progress-row__value" style={{ color }}>{value}</span>
      </div>
      <div className="dash-progress-row__track">
        <div
          className="dash-progress-row__fill"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }}
        />
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════════════════ */

export default function DashboardPage() {
  const { currentTenant } = useTenant();
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [saleStats, setSaleStats] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportOrder, setReportOrder] = useState('date_desc');

  // Live clock — update every 60s instead of 1s to avoid re-rendering the entire dashboard
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, st, ss, sl] = await Promise.all([
        fetchProducts(currentTenant.id),
        fetchProductStats(currentTenant.id),
        fetchSaleStats(currentTenant.id),
        fetchSales(currentTenant.id),
      ]);
      setProducts(prods);
      setStats(st);
      setSaleStats(ss);
      setSales(sl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentTenant.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleGenerateReport = () => {
    let sortedSales = [...sales];
    if (reportOrder === 'date_desc') sortedSales.sort((a, b) => b.saleDate - a.saleDate);
    if (reportOrder === 'date_asc') sortedSales.sort((a, b) => a.saleDate - b.saleDate);
    if (reportOrder === 'amount_desc') sortedSales.sort((a, b) => b.totalAmount - a.totalAmount);
    if (reportOrder === 'amount_asc') sortedSales.sort((a, b) => a.totalAmount - b.totalAmount);
    if (reportOrder === 'seller') sortedSales.sort((a, b) => a.sellerName.localeCompare(b.sellerName));

    const columns = ['ID', 'Fecha', 'Vendedor', 'Productos', 'Total', 'Estado'];
    const data = sortedSales.map(s => [
      s.id,
      s.saleDate.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      s.sellerName,
      s.items.map(i => `${i.productName} (x${i.quantity})`).join(', '),
      `$${s.totalAmount.toLocaleString()}`,
      SALE_STATUS[s.status]?.label || s.status
    ]);

    generatePdf('Reporte de Ventas (Dashboard)', columns, data, `ventas_dashboard_${Date.now()}.pdf`);
    setShowReportModal(false);
  };

  // Derived data
  const sparkSales = useMemo(() => generateSparkline(24, 20, 95), []);
  const sparkRevenue = useMemo(() => generateSparkline(24, 30, 90), []);
  const sparkVisitors = useMemo(() => generateSparkline(24, 15, 80), []);
  const barData = useMemo(() => generateBarData(), []);
  const heatmap = useMemo(() => generateHeatmapData(5, 14), []);

  const categoryStock = useMemo(() => {
    const cats = {};
    products.forEach((p) => {
      cats[p.category] = (cats[p.category] || 0) + p.stock;
    });
    return Object.entries(cats).sort((a, b) => b[1] - a[1]);
  }, [products]);

  const maxCatStock = categoryStock.length > 0 ? categoryStock[0][1] : 1;

  const lowStockProducts = useMemo(() =>
    products.filter((p) => p.stock <= p.minStock + 2).slice(0, 5),
    [products]
  );

  if (loading) {
    return (
      <div className="dash-loading">
        <span className="dash-loading__spinner" />
        <span>Cargando dashboard...</span>
      </div>
    );
  }

  return (
    <div className="dash" id="dashboard-page">
      {/* ─── Top Bar ─── */}
      <header className="dash__top">
        <div className="dash__top-left">
          <h1 className="dash__greeting">Dashboard</h1>
          <span className="dash__updated">
            Última actualización: {now.toLocaleTimeString('es-MX')}
          </span>
        </div>
        <div className="dash__top-right">
          <span className="dash__live-dot" />
          <span className="dash__live-text">En vivo</span>
          <div className="dash__user-chip">
            <span>{user?.avatar}</span>
            <span>{user?.name?.split(' ')[0]}</span>
          </div>
        </div>
      </header>

      {/* ═══ KPI Row ═══ */}
      <section className="dash__kpi-row">
        <div className="dash-kpi dash-kpi--indigo">
          <div className="dash-kpi__header">
            <span className="dash-kpi__icon">💰</span>
            <span className="dash-kpi__trend dash-kpi__trend--up">▲ 12.5%</span>
          </div>
          <span className="dash-kpi__value">${saleStats?.totalRevenue?.toLocaleString()}</span>
          <span className="dash-kpi__label">Ingresos Totales</span>
          <SparklineChart data={sparkRevenue} color="#818cf8" height={40} fillOpacity={0.2} />
        </div>

        <div className="dash-kpi dash-kpi--cyan">
          <div className="dash-kpi__header">
            <span className="dash-kpi__icon">🧾</span>
            <span className="dash-kpi__trend dash-kpi__trend--up">▲ 8.3%</span>
          </div>
          <span className="dash-kpi__value">{saleStats?.totalSales}</span>
          <span className="dash-kpi__label">Ventas Totales</span>
          <SparklineChart data={sparkSales} color="#22d3ee" height={40} fillOpacity={0.2} />
        </div>

        <div className="dash-kpi dash-kpi--emerald">
          <div className="dash-kpi__header">
            <span className="dash-kpi__icon">📦</span>
            <span className="dash-kpi__trend dash-kpi__trend--up">▲ 3.1%</span>
          </div>
          <span className="dash-kpi__value">{stats?.totalItems?.toLocaleString()}</span>
          <span className="dash-kpi__label">Unidades en Stock</span>
          <SparklineChart data={sparkVisitors} color="#34d399" height={40} fillOpacity={0.2} />
        </div>

        <div className="dash-kpi dash-kpi--amber">
          <div className="dash-kpi__header">
            <span className="dash-kpi__icon">⚠️</span>
            {stats?.lowStockCount > 0 && (
              <span className="dash-kpi__trend dash-kpi__trend--down">Alerta</span>
            )}
          </div>
          <span className="dash-kpi__value">{stats?.lowStockCount}</span>
          <span className="dash-kpi__label">Productos Stock Bajo</span>
          <div className="dash-kpi__mini-bar">
            <div className="dash-kpi__mini-bar-fill" style={{ width: `${((stats?.lowStockCount || 0) / (stats?.totalProducts || 1)) * 100}%` }} />
          </div>
        </div>
      </section>

      {/* ═══ Main Grid ═══ */}
      <div className="dash__grid">

        {/* ── Ventas Semanales (Bar Chart) ── */}
        <div className="dash-card dash-card--wide">
          <div className="dash-card__head">
            <h3 className="dash-card__title">📊 Ventas por Día — Semana Actual</h3>
            <span className="dash-card__badge">Semanal</span>
          </div>
          <BarChart data={barData} color="#06b6d4" />
        </div>

        {/* ── Tendencia de Ingresos (Sparkline) ── */}
        <div className="dash-card">
          <div className="dash-card__head">
            <h3 className="dash-card__title">📈 Tendencia de Ingresos</h3>
            <span className="dash-card__badge dash-card__badge--green">+12.5%</span>
          </div>
          <SparklineChart data={sparkRevenue} color="#6366f1" height={100} label="" fillOpacity={0.12} />
          <div className="dash-card__sparkline-stats">
            <div><span className="dash-card__stat-val">${saleStats?.avgTicket?.toLocaleString()}</span><span className="dash-card__stat-lbl">Ticket Promedio</span></div>
            <div><span className="dash-card__stat-val">{saleStats?.completedSales}</span><span className="dash-card__stat-lbl">Completadas</span></div>
            <div><span className="dash-card__stat-val">{saleStats?.pendingSales}</span><span className="dash-card__stat-lbl">Pendientes</span></div>
          </div>
        </div>

        {/* ── Estado Operativo ── */}
        <div className="dash-card">
          <div className="dash-card__head">
            <h3 className="dash-card__title">🟢 Estado Operativo</h3>
          </div>
          <div className="dash-ops">
            <div className="dash-ops__item dash-ops__item--green">
              <span className="dash-ops__dot" style={{ background: '#10b981' }} />
              <span className="dash-ops__name">Inventario</span>
              <span className="dash-ops__val" style={{ color: '#10b981' }}>Óptimo</span>
            </div>
            <div className={`dash-ops__item ${stats?.lowStockCount > 0 ? 'dash-ops__item--amber' : 'dash-ops__item--green'}`}>
              <span className="dash-ops__dot" style={{ background: stats?.lowStockCount > 0 ? '#f59e0b' : '#10b981' }} />
              <span className="dash-ops__name">Stock Bajo</span>
              <span className="dash-ops__val" style={{ color: stats?.lowStockCount > 0 ? '#f59e0b' : '#10b981' }}>{stats?.lowStockCount} alertas</span>
            </div>
            <div className="dash-ops__item dash-ops__item--green">
              <span className="dash-ops__dot" style={{ background: '#06b6d4' }} />
              <span className="dash-ops__name">Ventas</span>
              <span className="dash-ops__val" style={{ color: '#06b6d4' }}>Activas</span>
            </div>
            <div className="dash-ops__item dash-ops__item--green">
              <span className="dash-ops__dot" style={{ background: '#8b5cf6' }} />
              <span className="dash-ops__name">Sistema</span>
              <span className="dash-ops__val" style={{ color: '#8b5cf6' }}>Online</span>
            </div>
          </div>
        </div>

        {/* ── Donut KPIs ── */}
        <div className="dash-card">
          <div className="dash-card__head">
            <h3 className="dash-card__title">🎯 Rendimiento</h3>
          </div>
          <div className="dash-card__donuts">
            <DonutChart value={saleStats?.completedSales || 0} max={saleStats?.totalSales || 1} color="#10b981" label="Cierre" />
            <DonutChart value={stats?.totalItems || 0} max={(stats?.totalItems || 0) + 50} color="#6366f1" label="Stock" />
            <DonutChart value={stats?.categories || 0} max={8} color="#06b6d4" label="Cobertura" />
          </div>
        </div>

        {/* ── Stock por Categoría (Horizontal Bars) ── */}
        <div className="dash-card">
          <div className="dash-card__head">
            <h3 className="dash-card__title">📂 Stock por Categoría</h3>
          </div>
          <div className="dash-card__progress-list">
            {categoryStock.map(([cat, val], i) => (
              <ProgressRow
                key={cat}
                label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                value={val}
                max={maxCatStock}
                color={['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6'][i % 8]}
              />
            ))}
          </div>
        </div>

        {/* ── Actividad Reciente (Heatmap) ── */}
        <div className="dash-card dash-card--wide">
          <div className="dash-card__head">
            <h3 className="dash-card__title">🟩 Actividad del Sistema — Últimas 24h</h3>
            <div className="dash-heatmap-legend">
              <span>Bajo</span>
              <div className="dash-heatmap-legend__colors">
                <span style={{ background: 'rgba(255,255,255,0.06)' }} />
                <span style={{ background: '#10b981' }} />
                <span style={{ background: '#f59e0b' }} />
                <span style={{ background: '#6366f1' }} />
                <span style={{ background: '#ef4444' }} />
              </div>
              <span>Alto</span>
            </div>
          </div>
          <HeatmapGrid data={heatmap} />
        </div>

        {/* ── Últimas Ventas (Table) ── */}
        <div className="dash-card dash-card--wide">
          <div className="dash-card__head">
            <h3 className="dash-card__title">🧾 Últimas Ventas</h3>
            <span className="dash-card__badge">{sales.length} registros</span>
          </div>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Vendedor</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Método</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {sales.slice(0, 5).map((sale) => (
                  <tr 
                    key={sale.id}
                    className="dash-table__row dash-table__row--interactive"
                    title={`💡 Venta: ${sale.id}\n👤 Vendedor: ${sale.sellerName}\n📝 Notas: ${sale.notes || 'Ninguna'}\n👆 Click para opciones de reporte`}
                    onClick={() => setShowReportModal(true)}
                  >
                    <td><code className="dash-table__code">{sale.id}</code></td>
                    <td>{sale.saleDate.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}</td>
                    <td>{sale.sellerName}</td>
                    <td>
                      {sale.items.map((item, i) => (
                        <span key={i} className="dash-table__product">{item.productName} ×{item.quantity}</span>
                      ))}
                    </td>
                    <td className="dash-table__amount">${sale.totalAmount.toLocaleString()}</td>
                    <td>{PAYMENT_METHODS[sale.paymentMethod]?.icon} {PAYMENT_METHODS[sale.paymentMethod]?.label}</td>
                    <td>
                      <span className={`dash-table__status dash-table__status--${sale.status}`}>
                        {SALE_STATUS[sale.status]?.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Alertas de Stock ── */}
        <div className="dash-card">
          <div className="dash-card__head">
            <h3 className="dash-card__title">⚠️ Alertas de Stock</h3>
          </div>
          {lowStockProducts.length === 0 ? (
            <div className="dash-card__empty">
              <span>✅</span> Todo el inventario está en niveles óptimos
            </div>
          ) : (
            <div className="dash-alerts">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="dash-alert-item">
                  <img src={p.imageUrl} alt={p.name} className="dash-alert-item__img" />
                  <div className="dash-alert-item__info">
                    <span className="dash-alert-item__name">{p.name}</span>
                    <span className="dash-alert-item__stock">
                      Stock: <strong style={{ color: p.stock <= p.minStock ? '#f59e0b' : '#10b981' }}>{p.stock}</strong> / mín: {p.minStock}
                    </span>
                  </div>
                  <div className="dash-alert-item__bar-wrap">
                    <div
                      className="dash-alert-item__bar"
                      style={{
                        width: `${Math.min((p.stock / (p.minStock * 3)) * 100, 100)}%`,
                        background: p.stock <= p.minStock
                          ? 'linear-gradient(90deg, #ef4444, #f59e0b)'
                          : 'linear-gradient(90deg, #f59e0b, #10b981)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Top Productos ── */}
        <div className="dash-card">
          <div className="dash-card__head">
            <h3 className="dash-card__title">🏆 Top Productos</h3>
          </div>
          <div className="dash-top-products">
            {products.slice(0, 5).map((p, i) => (
              <div key={p.id} className="dash-top-item">
                <span className="dash-top-item__rank">#{i + 1}</span>
                <img src={p.imageUrl} alt={p.name} className="dash-top-item__img" />
                <div className="dash-top-item__info">
                  <span className="dash-top-item__name">{p.name}</span>
                  <span className="dash-top-item__meta">{p.brand} · {p.category}</span>
                </div>
                <span className="dash-top-item__price">${p.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Report Modal ─── */}
      {showReportModal && (
        <div className="crud-modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="crud-modal crud-modal--sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="crud-modal__title">📄 Reporte de Ventas</h2>
            <p className="crud-modal__text">Configura el reporte de ventas antes de generarlo.</p>
            <div className="crud-modal__form">
              <div className="crud-modal__field">
                <label>Ordenar por</label>
                <select value={reportOrder} onChange={(e) => setReportOrder(e.target.value)}>
                  <option value="date_desc">Fecha (Más recientes primero)</option>
                  <option value="date_asc">Fecha (Más antiguos primero)</option>
                  <option value="amount_desc">Monto (Mayor a menor)</option>
                  <option value="amount_asc">Monto (Menor a mayor)</option>
                  <option value="seller">Vendedor (A-Z)</option>
                </select>
              </div>
            </div>
            <div className="crud-modal__actions" style={{ marginTop: '1.5rem' }}>
              <button className="crud-modal__btn crud-modal__btn--cancel" onClick={() => setShowReportModal(false)}>
                Cancelar
              </button>
              <button 
                className="crud-modal__btn crud-modal__btn--primary" 
                onClick={handleGenerateReport}
              >
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
