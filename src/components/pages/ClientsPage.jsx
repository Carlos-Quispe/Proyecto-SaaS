import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../../context/TenantContext';
import { generatePdf } from '../../services/pdfService';
import { fetchClients, createClientRecord, updateClientRecord, deleteClientRecord, CLIENT_TYPES } from '../../services/clientsService';
import FeedbackToast from '../FeedbackToast';
import './CrudPage.css';

export default function ClientsPage() {
  const { currentTenant } = useTenant();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportConfig, setReportConfig] = useState({ filter: 'Todos', order: 'purchases_desc' });
  const [toast, setToast] = useState(null);

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchClients(currentTenant.id);
      setClients(data);
    } catch (err) {
      console.error(err);
      setToast({
        title: 'No se pudieron cargar clientes',
        message: err.message || 'Revisa la conexion.',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [currentTenant.id]);

  useEffect(() => { loadClients(); }, [loadClients]);

  const filtered = clients.filter((client) => {
    const term = search.toLowerCase();
    const matchSearch =
      client.name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term);
    const matchType = typeFilter === 'Todos' || client.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleGenerateReport = () => {
    let result = [...filtered];
    if (reportConfig.filter !== 'Todos') {
      result = result.filter((client) => client.type === reportConfig.filter);
    }
    if (reportConfig.order === 'purchases_desc') result.sort((a, b) => b.totalPurchases - a.totalPurchases);
    if (reportConfig.order === 'purchases_asc') result.sort((a, b) => a.totalPurchases - b.totalPurchases);
    if (reportConfig.order === 'name_asc') result.sort((a, b) => a.name.localeCompare(b.name));

    const columns = ['Nombre', 'Email', 'Telefono', 'Tipo', 'Total Compras', 'Ultima Compra'];
    const data = result.map((client) => [
      client.name,
      client.email,
      client.phone,
      client.type,
      `$${client.totalPurchases.toLocaleString()}`,
      client.lastPurchase,
    ]);

    generatePdf('Reporte de Clientes', columns, data, `clientes_${Date.now()}.pdf`);
    setShowReportModal(false);
  };

  const handleSave = async (formData) => {
    try {
      if (editItem) {
        const savedClient = await updateClientRecord(currentTenant.id, editItem.id, { ...editItem, ...formData });
        setClients((prev) => prev.map((client) => (client.id === editItem.id ? savedClient : client)));
        setToast({
          title: 'Cliente actualizado',
          message: `${formData.name} se guardo correctamente.`,
          type: 'success',
        });
      } else {
        const newClient = await createClientRecord(currentTenant.id, formData);
        setClients((prev) => [newClient, ...prev]);
        setToast({
          title: 'Cliente agregado',
          message: `${formData.name} fue agregado a la cartera.`,
          type: 'success',
        });
      }
      setShowModal(false);
      setEditItem(null);
    } catch (err) {
      console.error(err);
      setToast({
        title: 'No se pudo guardar',
        message: err.message || 'Intentalo nuevamente.',
        type: 'danger',
      });
    }
  };

  const handleDelete = async (id) => {
    const client = clients.find((item) => item.id === id);
    try {
      await deleteClientRecord(currentTenant.id, id);
      setClients((prev) => prev.filter((item) => item.id !== id));
      setDeleteConfirm(null);
      setToast({
        title: 'Cliente eliminado',
        message: `${client?.name || 'El cliente'} fue eliminado.`,
        type: 'danger',
      });
    } catch (err) {
      console.error(err);
      setToast({
        title: 'No se pudo eliminar',
        message: err.message || 'Intentalo nuevamente.',
        type: 'danger',
      });
    }
  };

  return (
    <div className="crud-page" id="clients-page">
      <header className="crud-page__header">
        <div>
          <h1 className="crud-page__title">Clientes</h1>
          <p className="crud-page__desc">Gestion de la cartera de clientes</p>
        </div>
        <div className="crud-page__header-actions">
          <button className="crud-page__btn-secondary" onClick={() => setShowReportModal(true)}>
            Generar Reporte
          </button>
          <button className="crud-page__add-btn" onClick={() => { setEditItem(null); setShowModal(true); }} id="add-client-btn">
            + Nuevo Cliente
          </button>
        </div>
      </header>

      <div className="crud-page__filters">
        <div className="crud-page__search-wrap">
          <span className="crud-page__search-icon">Q</span>
          <input className="crud-page__search" type="text" placeholder="Buscar por nombre o email..." value={search} onChange={(e) => setSearch(e.target.value)} id="client-search" />
        </div>
        <div className="crud-page__filter-pills">
          {CLIENT_TYPES.map((type) => (
            <button key={type} className={`crud-page__pill ${typeFilter === type ? 'crud-page__pill--active' : ''}`} onClick={() => setTypeFilter(type)}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="crud-page__loading">
          <span className="crud-page__spinner" />
          Cargando clientes...
        </div>
      ) : (
        <div className="crud-page__table-wrap">
          <table className="crud-table" id="clients-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Telefono</th>
                <th>Tipo</th>
                <th>Total Compras</th>
                <th>Ultima Compra</th>
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
                        <button className="crud-table__action-btn crud-table__action-btn--edit" onClick={() => { setEditItem(client); setShowModal(true); }} title="Editar">E</button>
                        <button className="crud-table__action-btn crud-table__action-btn--delete" onClick={() => setDeleteConfirm(client.id)} title="Eliminar">X</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <ClientModal item={editItem} onSave={handleSave} onClose={() => { setShowModal(false); setEditItem(null); }} />
      )}

      {deleteConfirm && (
        <div className="crud-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="crud-modal crud-modal--sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="crud-modal__title">Confirmar eliminacion</h2>
            <p className="crud-modal__text">Eliminar este cliente?</p>
            <div className="crud-modal__actions">
              <button className="crud-modal__btn crud-modal__btn--cancel" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button className="crud-modal__btn crud-modal__btn--danger" onClick={() => handleDelete(deleteConfirm)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="crud-modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="crud-modal crud-modal--sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="crud-modal__title">Reporte de Clientes</h2>
            <div className="crud-modal__form">
              <div className="crud-modal__field">
                <label>Filtrar por Tipo</label>
                <select
                  value={reportConfig.filter}
                  onChange={(e) => setReportConfig({ ...reportConfig, filter: e.target.value })}
                >
                  {CLIENT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
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
              <button className="crud-modal__btn crud-modal__btn--primary" onClick={handleGenerateReport}>Descargar PDF</button>
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
        <h2 className="crud-modal__title">{item ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
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
              <label>Telefono</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
          </div>
          <div className="crud-modal__field">
            <label>Tipo de Cliente</label>
            <select name="type" value={form.type} onChange={handleChange}>
              {CLIENT_TYPES.filter((type) => type !== 'Todos').map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
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
