import { useState } from 'react';
import { generatePdf } from '../../services/pdfService';
import FeedbackToast from '../FeedbackToast';
import './CrudPage.css';

const MOCK_USERS = [
  { id: 'user_001', name: 'Carlos Administrador', email: 'admin@techstore.com', username: 'admin', role: 'admin', avatar: '👨‍💼', status: 'active', lastLogin: '2026-05-02 18:30' },
  { id: 'user_002', name: 'María Vendedora', email: 'maria@techstore.com', username: 'vendedor', role: 'seller', avatar: '👩‍💻', status: 'active', lastLogin: '2026-05-02 17:45' },
  { id: 'user_003', name: 'Pedro López', email: 'pedro@techstore.com', username: 'pedro', role: 'seller', avatar: '👨‍🔧', status: 'active', lastLogin: '2026-05-01 09:20' },
  { id: 'user_004', name: 'Laura Torres', email: 'laura@techstore.com', username: 'laura', role: 'seller', avatar: '👩‍🏫', status: 'inactive', lastLogin: '2026-04-15 14:00' },
];

export default function UsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportConfig, setReportConfig] = useState({ filter: 'all', order: 'name_asc' });
  const [toast, setToast] = useState(null);

  const handleGenerateReport = () => {
    let result = [...users];
    if (reportConfig.filter !== 'all') {
      result = result.filter(u => u.role === reportConfig.filter);
    }
    if (reportConfig.order === 'name_asc') result.sort((a, b) => a.name.localeCompare(b.name));
    if (reportConfig.order === 'lastLogin_desc') {
      result.sort((a, b) => (b.lastLogin || '').localeCompare(a.lastLogin || ''));
    }

    const columns = ['Usuario', 'Username', 'Email', 'Rol', 'Último Acceso', 'Estado'];
    const data = result.map(u => [
      u.name,
      u.username,
      u.email,
      u.role === 'admin' ? 'Administrador' : 'Vendedor',
      u.lastLogin,
      u.status === 'active' ? 'Activo' : 'Inactivo'
    ]);

    generatePdf('Reporte de Usuarios', columns, data, `usuarios_${Date.now()}.pdf`);
    setShowReportModal(false);
  };

  const handleSave = (formData) => {
    if (editItem) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editItem.id ? { ...u, ...formData } : u))
      );
      setToast({
        title: 'Usuario actualizado',
        message: `${formData.name} se guardo correctamente.`,
        type: 'success',
      });
    } else {
      setUsers((prev) => [{
        ...formData,
        id: `user_${Date.now()}`,
        avatar: formData.role === 'admin' ? '👨‍💼' : '👩‍💻',
        status: 'active',
        lastLogin: '-',
      }, ...prev]);
      setToast({
        title: 'Usuario agregado',
        message: `${formData.name} ya puede acceder al sistema.`,
        type: 'success',
      });
    }
    setShowModal(false);
    setEditItem(null);
  };

  const handleDelete = (id) => {
    const deletedUser = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteConfirm(null);
    setToast({
      title: 'Usuario eliminado',
      message: `${deletedUser?.name || 'El usuario'} fue eliminado.`,
      type: 'danger',
    });
  };

  const toggleStatus = (id) => {
    const selectedUser = users.find((u) => u.id === id);
    const nextStatus = selectedUser?.status === 'active' ? 'inactive' : 'active';
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      )
    );
    setToast({
      title: nextStatus === 'active' ? 'Usuario activado' : 'Usuario desactivado',
      message: `${selectedUser?.name || 'El usuario'} cambio de estado.`,
      type: 'info',
    });
  };

  return (
    <div className="crud-page" id="users-page">
      <header className="crud-page__header">
        <div>
          <h1 className="crud-page__title">🔐 Usuarios</h1>
          <p className="crud-page__desc">Gestión de usuarios del sistema</p>
        </div>
        <div className="crud-page__header-actions">
          <button className="crud-page__btn-secondary" onClick={() => setShowReportModal(true)}>
            📄 Generar Reporte
          </button>
          <button className="crud-page__add-btn" onClick={() => { setEditItem(null); setShowModal(true); }} id="add-user-btn">
            + Nuevo Usuario
          </button>
        </div>
      </header>

      <div className="crud-page__table-wrap">
        <table className="crud-table" id="users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Username</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Último Acceso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="crud-table__row">
                <td>
                  <div className="crud-table__product-cell">
                    <span style={{ fontSize: '1.5rem' }}>{u.avatar}</span>
                    <span className="crud-table__product-name">{u.name}</span>
                  </div>
                </td>
                <td><code className="crud-table__sku">{u.username}</code></td>
                <td>{u.email}</td>
                <td>
                  <span className="crud-table__cat-badge">
                    {u.role === 'admin' ? '🛡️ Admin' : '🏷️ Vendedor'}
                  </span>
                </td>
                <td style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{u.lastLogin}</td>
                <td>
                  <span className={`crud-table__status crud-table__status--${u.status}`}>
                    {u.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="crud-table__actions">
                    <button className="crud-table__action-btn crud-table__action-btn--edit" onClick={() => { setEditItem(u); setShowModal(true); }} title="Editar">✏️</button>
                    <button className="crud-table__action-btn" onClick={() => toggleStatus(u.id)} title={u.status === 'active' ? 'Desactivar' : 'Activar'} style={{ fontSize: '0.75rem' }}>
                      {u.status === 'active' ? '🔒' : '🔓'}
                    </button>
                    <button className="crud-table__action-btn crud-table__action-btn--delete" onClick={() => setDeleteConfirm(u.id)} title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <UserModal item={editItem} onSave={handleSave} onClose={() => { setShowModal(false); setEditItem(null); }} />
      )}

      {deleteConfirm && (
        <div className="crud-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="crud-modal crud-modal--sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="crud-modal__title">⚠️ Confirmar Eliminación</h2>
            <p className="crud-modal__text">¿Eliminar este usuario?</p>
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
            <h2 className="crud-modal__title">📄 Reporte de Usuarios</h2>
            <div className="crud-modal__form">
              <div className="crud-modal__field">
                <label>Filtrar por Rol</label>
                <select 
                  value={reportConfig.filter} 
                  onChange={(e) => setReportConfig({ ...reportConfig, filter: e.target.value })}
                >
                  <option value="all">Todos</option>
                  <option value="admin">Administrador</option>
                  <option value="seller">Vendedor</option>
                </select>
              </div>
              <div className="crud-modal__field">
                <label>Ordenar por</label>
                <select 
                  value={reportConfig.order} 
                  onChange={(e) => setReportConfig({ ...reportConfig, order: e.target.value })}
                >
                  <option value="name_asc">Nombre (A-Z)</option>
                  <option value="lastLogin_desc">Último Acceso (Recientes)</option>
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

function UserModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({
    name: item?.name || '',
    username: item?.username || '',
    email: item?.email || '',
    role: item?.role || 'seller',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="crud-modal-overlay" onClick={onClose}>
      <div className="crud-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="crud-modal__title">{item ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="crud-modal__form">
          <div className="crud-modal__row">
            <div className="crud-modal__field">
              <label>Nombre Completo</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="crud-modal__field">
              <label>Username</label>
              <input name="username" value={form.username} onChange={handleChange} required />
            </div>
          </div>
          <div className="crud-modal__row">
            <div className="crud-modal__field">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="crud-modal__field">
              <label>Rol</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="admin">Administrador</option>
                <option value="seller">Vendedor</option>
              </select>
            </div>
          </div>
          <div className="crud-modal__field">
            <label>{item ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} {...(!item && { required: true })} />
          </div>
          <div className="crud-modal__actions">
            <button type="button" className="crud-modal__btn crud-modal__btn--cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="crud-modal__btn crud-modal__btn--primary">{item ? 'Guardar' : 'Crear Usuario'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
