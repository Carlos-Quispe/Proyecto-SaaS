import { useTenant } from '../context/TenantContext';
import './TenantSwitcher.css';

export default function TenantSwitcher() {
  const { currentTenant, switchTenant, TENANTS } = useTenant();

  return (
    <div className="tenant-switcher">
      <span className="tenant-switcher__label">Perfil activo:</span>
      <div className="tenant-switcher__buttons">
        {Object.entries(TENANTS).map(([key, tenant]) => (
          <button
            key={key}
            id={`tenant-switch-${key}`}
            className={`tenant-switcher__btn ${
              currentTenant.id === tenant.id ? 'tenant-switcher__btn--active' : ''
            }`}
            style={{
              '--tenant-color': tenant.color,
              '--tenant-gradient': tenant.gradient,
            }}
            onClick={() => switchTenant(key)}
          >
            <span className="tenant-switcher__avatar">{tenant.avatar}</span>
            <div className="tenant-switcher__info">
              <span className="tenant-switcher__name">{tenant.name}</span>
              <span className="tenant-switcher__tagline">{tenant.tagline}</span>
            </div>
            {currentTenant.id === tenant.id && (
              <span className="tenant-switcher__check">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
