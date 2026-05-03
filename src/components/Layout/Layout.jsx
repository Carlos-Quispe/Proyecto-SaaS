import { useState } from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

export default function Layout({ children, activePage, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`layout ${collapsed ? 'layout--collapsed' : ''}`}>
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <main className="layout__main" id="main-content">
        {children}
      </main>
    </div>
  );
}
