import { AuthProvider, useAuth } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';
import Login from './components/Login/Login';
import AppShell from './components/AppShell';

function AuthGate() {
  const { user, authLoading } = useAuth();
  if (authLoading) return <div className="dash-loading"><span className="dash-loading__spinner" /><span>Cargando sesion...</span></div>;
  if (!user) return <Login />;
  return <AppShell />;
}

function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <AuthGate />
      </TenantProvider>
    </AuthProvider>
  );
}

export default App;
