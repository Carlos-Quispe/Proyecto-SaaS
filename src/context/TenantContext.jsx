import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from './AuthContext';

// ─── Tenant Definitions ───
export const TENANTS = {
  alpha: {
    id: 'tenant_techstore_alpha',
    name: 'TechStore Alpha',
    tagline: 'Premium Consumer Electronics',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
    avatar: 'α',
  },
  beta: {
    id: 'tenant_techstore_beta',
    name: 'TechStore Beta',
    tagline: 'Enterprise & Gaming Solutions',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)',
    avatar: 'β',
  },
};

const TenantContext = createContext(null);

export function TenantProvider({ children }) {
  const { user } = useAuth();
  const [currentTenant, setCurrentTenant] = useState(TENANTS.alpha);

  const switchTenant = useCallback((tenantKey) => {
    const tenant = TENANTS[tenantKey];
    if (tenant) {
      setCurrentTenant(tenant);
    }
  }, []);

  useEffect(() => {
    if (!user?.clientId) return;
    const tenant = Object.values(TENANTS).find((item) => item.id === user.clientId);
    if (tenant) setCurrentTenant(tenant);
  }, [user?.clientId]);

  const contextValue = useMemo(
    () => ({ currentTenant, switchTenant, TENANTS }),
    [currentTenant, switchTenant]
  );

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
