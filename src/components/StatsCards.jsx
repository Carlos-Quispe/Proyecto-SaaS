import './StatsCards.css';

export default function StatsCards({ stats, loading }) {
  const cards = [
    {
      id: 'stat-products',
      label: 'Productos',
      value: stats?.totalProducts ?? '—',
      icon: '📦',
      color: '#6366f1',
    },
    {
      id: 'stat-items',
      label: 'Unidades en Stock',
      value: stats?.totalItems ?? '—',
      icon: '🏷️',
      color: '#06b6d4',
    },
    {
      id: 'stat-value',
      label: 'Valor del Inventario',
      value: stats?.totalValue
        ? `$${stats.totalValue.toLocaleString('en-US')}`
        : '—',
      icon: '💰',
      color: '#10b981',
    },
    {
      id: 'stat-lowstock',
      label: 'Stock Bajo',
      value: stats?.lowStockCount ?? '—',
      icon: '⚠️',
      color: stats?.lowStockCount > 0 ? '#f59e0b' : '#10b981',
      alert: stats?.lowStockCount > 0,
    },
    {
      id: 'stat-categories',
      label: 'Categorías',
      value: stats?.categories ?? '—',
      icon: '📂',
      color: '#8b5cf6',
    },
    {
      id: 'stat-avgprice',
      label: 'Precio Promedio',
      value: stats?.avgPrice
        ? `$${stats.avgPrice.toLocaleString('en-US')}`
        : '—',
      icon: '📊',
      color: '#ec4899',
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, i) => (
        <div
          key={card.id}
          id={card.id}
          className={`stats-card ${loading ? 'stats-card--loading' : ''} ${card.alert ? 'stats-card--alert' : ''}`}
          style={{
            '--card-color': card.color,
            '--anim-delay': `${i * 0.08}s`,
          }}
        >
          <div className="stats-card__icon">{card.icon}</div>
          <div className="stats-card__content">
            <span className="stats-card__value">
              {loading ? '' : card.value}
            </span>
            <span className="stats-card__label">{card.label}</span>
          </div>
          <div className="stats-card__glow" />
        </div>
      ))}
    </div>
  );
}
