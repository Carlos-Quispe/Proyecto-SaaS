import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import {
  isLocalFallbackEnabled,
  isSupabaseConfigured,
  supabase,
  supabaseConfigError,
} from '../lib/supabaseClient';

const MOCK_USERS = [
  {
    id: 'user_001',
    username: 'admin',
    password: '1234',
    name: 'Carlos Administrador',
    email: 'admin@techstore.com',
    role: 'admin',
    avatar: 'CA',
    clientId: 'tenant_techstore_alpha',
  },
  {
    id: 'user_002',
    username: 'vendedor',
    password: '1234',
    name: 'Maria Vendedora',
    email: 'maria@techstore.com',
    role: 'seller',
    avatar: 'MV',
    clientId: 'tenant_techstore_alpha',
  },
];

const AuthContext = createContext(null);

function toAppUser(profile, authUser) {
  return {
    id: authUser?.id || profile.id,
    username: profile.username || profile.email,
    name: profile.name || authUser?.email || 'Usuario',
    email: profile.email || authUser?.email || '',
    role: profile.role || 'seller',
    avatar: profile.avatar || (profile.role === 'admin' ? 'AD' : 'VE'),
    clientId: profile.tenant_id || profile.clientId,
  };
}

async function fetchProfile(authUser) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (error) throw error;
  return toAppUser(data, authUser);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    let isMounted = true;

    async function loadSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (data.session?.user) {
          try {
            const profile = await fetchProfile(data.session.user);
            if (isMounted) setUser(profile);
          } catch (err) {
            console.error(err);
            if (isMounted) setLoginError('No se encontro el perfil del usuario.');
          }
        }
      } catch (err) {
        console.error('Error al obtener sesion:', err);
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }

      try {
        const profile = await fetchProfile(session.user);
        setUser(profile);
      } catch (err) {
        console.error(err);
      }
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (usernameOrEmail, password) => {
    setLoginError('');

    if (isLocalFallbackEnabled) {
      const found = MOCK_USERS.find(
        (u) => u.username === usernameOrEmail && u.password === password
      );
      if (found) {
        const { password: _, ...safeUser } = found;
        setUser(safeUser);
        return true;
      }
      setLoginError('Usuario o contrasena incorrectos');
      return false;
    }

    if (!isSupabaseConfigured) {
      setLoginError(supabaseConfigError);
      return false;
    }

    try {
      if (!usernameOrEmail.includes('@')) {
        setLoginError('En Supabase inicia sesion con tu email.');
        return false;
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email: usernameOrEmail, password });
      if (error) throw error;

      const profile = await fetchProfile(data.user);
      setUser(profile);
      return true;
    } catch (err) {
      console.error(err);
      setLoginError('Usuario o contrasena incorrectos');
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setLoginError('');
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
  }, []);

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);
  const isSeller = useMemo(() => user?.role === 'seller', [user]);

  const contextValue = useMemo(
    () => ({ user, login, logout, loginError, isAdmin, isSeller, setLoginError, authLoading }),
    [user, login, logout, loginError, isAdmin, isSeller, authLoading]
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
