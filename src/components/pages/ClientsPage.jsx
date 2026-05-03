import { useState } from 'react';
import { generatePdf } from '../../services/pdfService';
import FeedbackToast from '../FeedbackToast';
import './CrudPage.css';

const MOCK_CLIENTS = [
  { id: 'cli_001', name: 'TechCorp México', email: 'contact@techcorp.mx', phone: '+52 55 1234 5678', type: 'Corporativo', status: 'active', totalPurchases: 15200.50, lastPurchase: '2026-04-28' },
  { id: 'cli_002', name: 'Ana García López', email: 'ana.garcia@gmail.com', phone: '+52 33 9876 5432', type: 'Individual', status: 'active', totalPurchases: 3499.99, lastPurchase: '2026-04-30' },
  { id: 'cli_003', name: 'Distribuidora Norte', email: 'ventas@distnorte.com', phone: '+52 81 5555 0001', type: 'Distribuidor', status: 'active', totalPurchases: 42500.00, lastPurchase: '2026-05-01' },
  { id: 'cli_004', name: 'Roberto Hernández', email: 'r.hernandez@outlook.com', phone: '+52 55 7777 8888', type: 'Individual', status: 'inactive', totalPurchases: 899.99, lastPurchase: '2026-03-15' },
  { id: 'cli_005', name: 'GameStation SA', email: 'info@gamestation.mx', phone: '+52 33 2222 3333', type: 'Corporativo', status: 'active', totalPurchases: 28750.00, lastPurchase: '2026-05-02' },
  { id: 'cli_006', name: 'Universidad Tech', email: 'compras@unitech.edu.mx', phone: '+52 22 4444 5555', type: 'Educación', status: 'active', totalPurchases: 65000.00, lastPurchase: '2026-04-25' },
];

const CLIENT_TYPES = ['Todos', 'Individual', 'Corporativo', 'Distribuidor', 'Educación'];

export default function ClientsPage() {
  const [clients, setClients] = useState(MOCK_CLIENTS);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportConfig, setReportConfig] = useState({ filter: 'Todos', order: 'purchases_desc' });
  const [toast, setToast] = useState(null);

  const filtered = clients.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'Todos' || c.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleGenerateReport = () => {
    let result = [...filtered];
    if (reportConfig.filter !== 'Todos') {
      result = result.filter(c => c.type === reportConfig.filter);
    }
    if (reportConfig.order === 'purchases_desc') result.sort((a, b) => b.totalPurchases - a.totalPurchases);
    if (reportConfig.order === 'purchases_asc') result.sort((a, b) => a.totalPurchases - b.totalPurchases);
    if (reportConfig.order === 'name_asc') result.sort((a, b) => a.name.localeCompare(b.name));

    const columns = ['Nombre', 'Email', 'Teléfono', 'Tipo', 'Total Compras', 'Última Compra'];
    const data = result.map(c => [
      c.name,
      c.email,
      c.phone,
      c.type,
      `$${c.totalPurchases.toLocaleString()}`,
      c.lastPurchase
    ]);

    generatePdf('Reporte de Clientes', columns, data, `clientes_${Date.now()}.pdf`);
    setShowReportModal(false);
  };

  const handleSave = (formData) => {
    if (editItem) {
      setClients((prev) =>
        prev.map((c) => (c.id === editItem.id ? { ...c, ...formData } : c))
      );
      setToast({
        title: 'Cliente actualizado',
        message: `${formData.name} se guardo correctamente.`,
        type: 'success',
      });
    } else {
      setClients((prev) => [{
        ...formData,
        id: `cli_${Date.now()}`,
        totalPurchases: 0,
        lastPurchase: '-',
        status: 'active',
      }, ...prev]);
      setToast({
        title: 'Cliente agregado',
        message: `${formData.name} fue agregado a la cartera.`,
        type: 'success',
      });
    }
    setShowModal(false);
    setEditItem(null);
  };

  const handleDelete = (id) => {
    const client = clients.find((c) => c.id === id);
    setClients((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirm(null);
    setToast({
      title: 'Cliente eliminado',
      message: `${client?.name || 'El cliente'} fue eliminado.`,
      type: 'danger',
    });
  };

  return (
    <div className="crud-page" id="clients-page">
      <header className="crud-page__header">
        <div>
          <h1 className="crud-page__title">👥 Clientes</h1>
          <p className="crud-page__desc">Gestión de la cartera de clientes</p>
        </div>
        <div className="crud-page__header-actions">
          <button className="crud-page__btn-secondary" onClick={() => setShowReportModal(true)}>
            📄 Generar Reporte
          </button>
          <button className="crud-page__add-btn" onClick={() => { setEditItem(null); setShowModal(true); }} id="add-client-btn">
            + Nuevo Cliente
          </button>
        </div>
      </header>

      <div className="crud-page__filters">
        <div className="crud-page__search-wrap">
          <span className="crud-page__search-icon">🔍</span>
          <input className="crud-page__search" type="text" placeholder="Buscar por nombre o email..." value={search} onChange={(e) => setSearch(e.target.value)} id="client-search" />
        </div>
        <div className="crud-page__filter-pills">
          {CLIENT_TYPES.map((t) => (
            <button key={t} className={`crud-page__pill ${typeFilter === t ? 'crud-page__pill--active' : ''}`} onClick={() => setTypeFilter(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="crud-page__table-wrap">
        <table className="crud-table" id="clients-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Tipo</th>
              <th>Total Compras</th>
              <th>Última Compra</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="crud-table__empty">No se encontraron clientes</td></tr>
            ) : (
              filtered.map((client) => (
                <tr key={client.id} className="crud-table__row">
                  <td>
                    <div>
                      <span className="crud-table__product-name">{client.name}</span>
                      <span className="crud-table__product-brand">{client.email}</span>
                    </div>
                  </td>
                  <td>{client.phone}</td>
                  <td><span className="crud-table__cat-badge">{client.type}</span></td>
                  <td className="crud-table__price">${client.totalPurchases.toLocaleString()}</td>
                  <td>{client.lastPurchase}</td>
                  <td>
                    <span className={`crud-table__status crud-table__status--${client.status}`}>
                      {client.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="crud-table__actions">
                      <button className="crud-table__action-btn crud-table__action-btn--edit" onClick={() => { setEditItem(client); setShowModal(true); }} title="Editar">✏️</button>
                      <button className="crud-table__action-btn crud-table__action-btn--delete" onClick={() => setDeleteConfirm(client.id)} title="Eliminar">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ClientModal item={editItem} onSave={handleSave} onClose={() => { setShowModal(false); setEditItem(null); }} />
      )}

      {deleteConfirm && (
        <div className="crud-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="crud-modal crud-modal--sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="crud-modal__title">⚠️ Confirmar Eliminación</h2>
            <p className="crud-modal__text">¿Eliminar este cliente?</p>
            <div className="crud-modal__actions">
              <button className="crud-modal__btn crud-modal__btn--cancel" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button className="crud-modal__btn crud-modal__btn--danger" onClick={() => handleDelete(deleteConfirm)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Report Modal ─── */}
      {showReportModal && (
        <div className="crud-modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="crud-modal crud-modal--sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="crud-modal__title">📄 Reporte de Clientes</h2>
            <div className="crud-modal__form">
              <div className="crud-modal__field">
                <label>Filtrar por Tipo</label>
                <select 
                  value={reportConfig.filter} 
                  onChange={(e) => setReportConfig({ ...reportConfig, filter: e.target.value })}
                >
                  {CLIENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="crud-modal__field">
                <label>Ordenar por</label>
                <select 
                  value={reportConfig.order} 
                  onChange={(e) => setReportConfig({ ...reportConfig, order: e.target.value })}
                >
                  <option value="purchases_desc">Total Compras (Mayor a menor)</option>
                  <option value="purchases_asc">Total Compras (Menor a mayor)</option>
                  <option value="name_asc">Nombre (A-Z)</option>
                </select>
              </div>
            </div>
            <div className="crud-modal__actions" style={{ marginTop: '1.5rem' }}>
              <button className="crud-modal__btn crud-modal__btn--cancel" onClick={() => setShowReportModal(false)}>Cancelar</button>
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
      <FeedbackToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function ClientModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({
    name: item?.name || '',
    email: item?.email || '',
    phone: item?.phone || '',
    type: item?.type || 'Individual',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="crud-modal-overlay" onClick={onClose}>
      <div className="crud-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="crud-modal__title">{item ? '✏️ Editar Cliente' : '➕ Nuevo Cliente'}</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="crud-modal__form">
          <div className="crud-modal__field">
            <label>Nombre</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="crud-modal__row">
            <div className="crud-modal__field">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="crud-modal__field">
              <label>Teléfono</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
          </div>
          <div className="crud-modal__field">
            <label>Tipo de Cliente</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="Individual">Individual</option>
              <option value="Corporativo">Corporativo</option>
              <option value="Distribuidor">Distribuidor</option>
              <option value="Educación">Educación</option>
            </select>
          </div>
          <div className="crud-modal__actions">
            <button type="button" className="crud-modal__btn crud-modal__btn--cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="crud-modal__btn crud-modal__btn--primary">{item ? 'Guardar' : 'Crear Cliente'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
