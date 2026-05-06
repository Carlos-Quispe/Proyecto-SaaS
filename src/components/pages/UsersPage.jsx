import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../../context/TenantContext';
import { generatePdf } from '../../services/pdfService';
import { isLocalFallbackEnabled, isSupabaseConfigured } from '../../lib/supabaseClient';
import {
  fetchUsers,
  createUserProfile,
  updateUserProfile,
  toggleUserProfileStatus,
  deleteUserProfile,
} from '../../services/usersService';
import FeedbackToast from '../FeedbackToast';
import './CrudPage.css';

export default function UsersPage() {
  const { currentTenant } = useTenant();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportConfig, setReportConfig] = useState({ filter: 'all', order: 'name_asc' });
  const [toast, setToast] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUsers(currentTenant.id);
      setUsers(data);
    } catch (err) {
      console.error(err);
      setToast({
        title: 'No se pudieron cargar usuarios',
        message: err.message || 'Revisa la conexion.',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [currentTenant.id]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleGenerateReport = () => {
    let result = [...users];
    if (reportConfig.filter !== 'all') {
      result = result.filter((user) => user.role === reportConfig.filter);
    }
    if (reportConfig.order === 'name_asc') result.sort((a, b) => a.name.localeCompare(b.name));
    if (reportConfig.order === 'lastLogin_desc') {
      result.sort((a, b) => (b.lastLogin || '').localeCompare(a.lastLogin || ''));
    }

    const columns = ['Usuario', 'Username', 'Email', 'Rol', 'Ultimo Acceso', 'Estado'];
    const data = result.map((user) => [
      user.name,
      user.username,
      user.email,
      user.role === 'admin' ? 'Administrador' : 'Vendedor',
      user.lastLogin,
      user.status === 'active' ? 'Activo' : 'Inactivo',
    ]);

    generatePdf('Reporte de Usuarios', columns, data, `usuarios_${Date.now()}.pdf`);
    setShowReportModal(false);
  };

  const handleSave = async (formData) => {
    try {
      if (editItem) {
        const savedUser = await updateUserProfile(currentTenant.id, editItem.id, { ...editItem, ...formData });
        setUsers((prev) => prev.map((user) => (user.id === editItem.id ? savedUser : user)));
        setToast({
          title: 'Usuario actualizado',
          message: `${formData.name} se guardo correctamente.`,
          type: 'success',
        });
      } else {
        const newUser = await createUserProfile(currentTenant.id, formData);
        setUsers((prev) => [newUser, ...prev]);
        setToast({
          title: 'Usuario agregado',
          message: `${formData.name} ya puede acceder al sistema.`,
          type: 'success',
        });
      }
      setShowModal(false);
      setEditItem(null);
    } catch (err) {
      console.error(err);
      setToast({
        title: 'No se pudo guardar usuario',
        message: err.message || 'Intentalo nuevamente.',
        type: 'danger',
      });
    }
  };

  const handleDelete = async (id) => {
    const deletedUser = users.find((user) => user.id === id);
    try {
      await deleteUserProfile(currentTenant.id, id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setDeleteConfirm(null);
      setToast({
        title: 'Usuario eliminado',
        message: `${deletedUser?.name || 'El usuario'} fue eliminado.`,
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

  const toggleStatus = async (id) => {
    const selectedUser = users.find((user) => user.id === id);
    const nextStatus = selectedUser?.status === 'active' ? 'inactive' : 'active';
    try {
      const updatedUser = await toggleUserProfileStatus(currentTenant.id, id, nextStatus);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? (updatedUser === true ? { ...user, status: nextStatus } : updatedUser) : user
        )
      );
      setToast({
        title: nextStatus === 'active' ? 'Usuario activado' : 'Usuario desactivado',
        message: `${selectedUser?.name || 'El usuario'} cambio de estado.`,
        type: 'info',
      });
    } catch (err) {
      console.error(err);
      setToast({
        title: 'No se pudo cambiar el estado',
        message: err.message || 'Intentalo nuevamente.',
        type: 'danger',
      });
    }
  };

  return (
    <div className="crud-page" id="users-page">
      <header className="crud-page__header">
        <div>
          <h1 className="crud-page__title">Usuarios</h1>
          <p className="crud-page__desc">Gestion de usuarios del sistema</p>
        </div>
        <div className="crud-page__header-actions">
          <button className="crud-page__btn-secondary" onClick={() => setShowReportModal(true)}>
            Generar Reporte
          </button>
          <button className="crud-page__add-btn" onClick={() => { setEditItem(null); setShowModal(true); }} id="add-user-btn">
            + Nuevo Usuario
          </button>
        </div>
      </header>

      {isSupabaseConfigured && (
        <div className="crud-page__filters">
          <p className="crud-page__desc">
            En Supabase, crea las credenciales en Auth y luego completa su fila en profiles. Desde aqui puedes editar rol, estado y datos internos.
          </p>
        </div>
      )}

      {loading ? (
        <div className="crud-page__loading">
          <span className="crud-page__spinner" />
          Cargando usuarios...
        </div>
      ) : (
        <div className="crud-page__table-wrap">
          <table className="crud-table" id="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Username</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Ultimo Acceso</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={7} className="crud-table__empty">No se encontraron usuarios</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="crud-table__row">
                    <td>
                      <div className="crud-table__product-cell">
                        <span style={{ fontSize: '1rem' }}>{user.avatar}</span>
                        <span className="crud-table__product-name">{user.name}</span>
                      </div>
                    </td>
                    <td><code className="crud-table__sku">{user.username}</code></td>
                    <td>{user.email}</td>
                    <td>
                      <span className="crud-table__cat-badge">
                        {user.role === 'admin' ? 'Admin' : 'Vendedor'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{user.lastLogin}</td>
                    <td>
                      <span className={`crud-table__status crud-table__status--${user.status}`}>
                        {user.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="crud-table__actions">
                        <button className="crud-table__action-btn crud-table__action-btn--edit" onClick={() => { setEditItem(user); setShowModal(true); }} title="Editar">E</button>
                        <button className="crud-table__action-btn" onClick={() => toggleStatus(user.id)} title={user.status === 'active' ? 'Desactivar' : 'Activar'} style={{ fontSize: '0.75rem' }}>
                          {user.status === 'active' ? 'Off' : 'On'}
                        </button>
                        <button className="crud-table__action-btn crud-table__action-btn--delete" onClick={() => setDeleteConfirm(user.id)} title="Eliminar">X</button>
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
        <UserModal item={editItem} onSave={handleSave} onClose={() => { setShowModal(false); setEditItem(null); }} />
      )}

      {deleteConfirm && (
        <div className="crud-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="crud-modal crud-modal--sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="crud-modal__title">Confirmar eliminacion</h2>
            <p className="crud-modal__text">Eliminar este usuario?</p>
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
            <h2 className="crud-modal__title">Reporte de Usuarios</h2>
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
                  <option value="lastLogin_desc">Ultimo Acceso (Recientes)</option>
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
        <h2 className="crud-modal__title">{item ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
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
          {!item && isLocalFallbackEnabled && (
            <div className="crud-modal__field">
              <label>Contrasena</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required />
            </div>
          )}
          <div className="crud-modal__actions">
            <button type="button" className="crud-modal__btn crud-modal__btn--cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="crud-modal__btn crud-modal__btn--primary">{item ? 'Guardar' : 'Crear Usuario'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
