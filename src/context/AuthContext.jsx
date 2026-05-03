import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// ─── Usuarios predefinidos ───
const MOCK_USERS = [
  {
    id: 'user_001',
    username: 'admin',
    password: '1234',
    name: 'Carlos Administrador',
    email: 'admin@techstore.com',
    role: 'admin',
    avatar: '👨‍💼',
    clientId: 'tenant_techstore_alpha',
  },
  {
    id: 'user_002',
    username: 'vendedor',
    password: '1234',
    name: 'María Vendedora',
    email: 'maria@techstore.com',
    role: 'seller',
    avatar: '👩‍💻',
    clientId: 'tenant_techstore_alpha',
  },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState('');

  const login = useCallback((username, password) => {
    setLoginError('');
    const found = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      return true;
    }
    setLoginError('Usuario o contraseña incorrectos');
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setLoginError('');
  }, []);

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);
  const isSeller = useMemo(() => user?.role === 'seller', [user]);

  const contextValue = useMemo(
    () => ({ user, login, logout, loginError, isAdmin, isSeller, setLoginError }),
    [user, login, logout, loginError, isAdmin, isSeller]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
