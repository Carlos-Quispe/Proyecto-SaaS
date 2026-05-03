import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard',  icon: '📊', roles: ['admin', 'seller'] },
  { key: 'products',  label: 'Productos',  icon: '🛍️', roles: ['admin', 'seller'] },
  { key: 'sales',     label: 'Ventas',     icon: '💰', roles: ['admin', 'seller'] },
  { key: 'clients',   label: 'Clientes',   icon: '👥', roles: ['admin'] },
  { key: 'users',     label: 'Usuarios',   icon: '🔐', roles: ['admin'] },
];

export default function Sidebar({ activePage, onNavigate, collapsed, onToggle }) {
  const { user, logout, isAdmin } = useAuth();

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`} id="sidebar">
      {/* ─── Brand ─── */}
      <div className="sidebar__brand">
        <div className="sidebar__logo-icon">📦</div>
        {!collapsed && (
          <div className="sidebar__brand-text">
            <span className="sidebar__brand-name">Stock Manager</span>
            <span className="sidebar__brand-tag">SaaS Platform</span>
          </div>
        )}
      </div>

      {/* ─── Toggle ─── */}
      <button
        className="sidebar__toggle"
        onClick={onToggle}
        aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        id="sidebar-toggle"
      >
        {collapsed ? '▶' : '◀'}
      </button>

      {/* ─── Navigation ─── */}
      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          {visibleItems.map((item) => (
            <li key={item.key}>
              <button
                className={`sidebar__link ${activePage === item.key ? 'sidebar__link--active' : ''}`}
                onClick={() => onNavigate(item.key)}
                title={collapsed ? item.label : undefined}
                id={`nav-${item.key}`}
              >
                <span className="sidebar__link-icon">{item.icon}</span>
                {!collapsed && <span className="sidebar__link-label">{item.label}</span>}
                {activePage === item.key && <span className="sidebar__active-indicator" />}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* ─── User Section ─── */}
      <div className="sidebar__user">
        <div className="sidebar__user-info">
          <span className="sidebar__user-avatar">{user?.avatar}</span>
          {!collapsed && (
            <div className="sidebar__user-meta">
              <span className="sidebar__user-name">{user?.name}</span>
              <span className="sidebar__user-role">
                {isAdmin ? 'Administrador' : 'Vendedor'}
              </span>
            </div>
          )}
        </div>
        <button
          className="sidebar__logout"
          onClick={logout}
          title="Cerrar Sesión"
          id="logout-btn"
        >
          {collapsed ? '🚪' : '🚪 Salir'}
        </button>
      </div>
    </aside>
  );
}