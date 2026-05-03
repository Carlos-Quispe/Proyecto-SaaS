import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout/Layout';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import SalesPage from './pages/SalesPage';
import ClientsPage from './pages/ClientsPage';
import UsersPage from './pages/UsersPage';

export default function AppShell() {
  const { isAdmin } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':   return <DashboardPage />;
      case 'products':    return <ProductsPage />;
      case 'sales':       return <SalesPage />;
      case 'clients':     return isAdmin ? <ClientsPage /> : <DashboardPage />;
      case 'users':       return isAdmin ? <UsersPage /> : <DashboardPage />;
      default:            return <DashboardPage />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </Layout>
  );
}
