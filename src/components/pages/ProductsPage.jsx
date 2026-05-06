import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { fetchProducts, createProduct, updateProduct, deleteProduct, CATEGORIES } from '../../services/productService';
import { generatePdf } from '../../services/pdfService';
import FeedbackToast from '../FeedbackToast';
import './CrudPage.css';

export default function ProductsPage() {
  const { currentTenant } = useTenant();
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportConfig, setReportConfig] = useState({ filter: 'all', order: 'name_asc' });
  const [toast, setToast] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProducts(currentTenant.id);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentTenant.id]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleGenerateReport = () => {
    let result = [...filtered];
    if (reportConfig.filter !== 'all') {
      result = result.filter(p => p.category === reportConfig.filter);
    }
    if (reportConfig.order === 'name_asc') result.sort((a, b) => a.name.localeCompare(b.name));
    if (reportConfig.order === 'name_desc') result.sort((a, b) => b.name.localeCompare(a.name));
    if (reportConfig.order === 'price_desc') result.sort((a, b) => b.price - a.price);
    if (reportConfig.order === 'price_asc') result.sort((a, b) => a.price - b.price);
    if (reportConfig.order === 'stock_asc') result.sort((a, b) => a.stock - b.stock);

    const columns = ['SKU', 'Nombre', 'Marca', 'Categoría', 'Precio', 'Stock'];
    const data = result.map(p => [
      p.sku,
      p.name,
      p.brand,
      p.category,
      `$${p.price.toLocaleString()}`,
      p.stock.toString()
    ]);

    generatePdf('Reporte de Productos', columns, data, `productos_${Date.now()}.pdf`);
    setShowReportModal(false);
  };

  const handleSave = async (formData) => {
    try {
      if (editItem) {
        const savedProduct = await updateProduct(editItem.id, { ...editItem, ...formData });
        setProducts((prev) =>
          prev.map((p) => (p.id === editItem.id ? savedProduct : p))
        );
        setToast({
          title: 'Producto actualizado',
          message: `${formData.name} se guardo correctamente.`,
          type: 'success',
        });
      } else {
        const newProduct = await createProduct(currentTenant.id, formData);
        setProducts((prev) => [newProduct, ...prev]);
        setToast({
          title: 'Producto agregado',
          message: `${formData.name} ya esta disponible en el catalogo.`,
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
    const product = products.find((p) => p.id === id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirm(null);
      setToast({
        title: 'Producto eliminado',
        message: `${product?.name || 'El producto'} fue retirado del catalogo.`,
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
    <div className="crud-page" id="products-page">
      {/* ─── Page Header ─── */}
      <header className="crud-page__header">
        <div>
          <h1 className="crud-page__title">🛍️ Productos</h1>
          <p className="crud-page__desc">Gestión del catálogo de productos</p>
        </div>
        <div className="crud-page__header-actions">
          <button className="crud-page__btn-secondary" onClick={() => setShowReportModal(true)}>
            📄 Generar Reporte
          </button>
          {isAdmin && (
            <button
              className="crud-page__add-btn"
              onClick={() => { setEditItem(null); setShowModal(true); }}
              id="add-product-btn"
            >
              + Nuevo Producto
            </button>
          )}
        </div>
      </header>

      {/* ─── Filters ─── */}
      <div className="crud-page__filters">
        <div className="crud-page__search-wrap">
          <span className="crud-page__search-icon">🔍</span>
          <input
            className="crud-page__search"
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="product-search"
          />
        </div>
        <div className="crud-page__filter-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`crud-page__pill ${categoryFilter === cat.key ? 'crud-page__pill--active' : ''}`}
              onClick={() => setCategoryFilter(cat.key)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Table ─── */}
      {loading ? (
        <div className="crud-page__loading">
          <span className="crud-page__spinner" />
          Cargando productos...
        </div>
      ) : (
        <div className="crud-page__table-wrap">
          <table className="crud-table" id="products-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                {isAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="crud-table__empty">
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="crud-table__row">
                    <td>
                      <div className="crud-table__product-cell">
                        <img src={product.imageUrl} alt={product.name} className="crud-table__product-img" />
                        <div>
                          <span className="crud-table__product-name">{product.name}</span>
                          <span className="crud-table__product-brand">{product.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td><code className="crud-table__sku">{product.sku}</code></td>
                    <td>
                      <span className="crud-table__cat-badge">{product.category}</span>
                    </td>
                    <td className="crud-table__price">${product.price.toLocaleString()}</td>
                    <td>
                      <span className={`crud-table__stock ${product.stock <= product.minStock ? 'crud-table__stock--low' : ''}`}>
                        {product.stock}
                        {product.stock <= product.minStock && ' ⚠️'}
                      </span>
                    </td>
                    <td>
                      <span className="crud-table__status crud-table__status--active">Activo</span>
                    </td>
                    {isAdmin && (
                      <td>
                        <div className="crud-table__actions">
                          <button
                            className="crud-table__action-btn crud-table__action-btn--edit"
                            onClick={() => { setEditItem(product); setShowModal(true); }}
                            title="Editar"
                          >✏️</button>
                          <button
                            className="crud-table__action-btn crud-table__action-btn--delete"
                            onClick={() => setDeleteConfirm(product.id)}
                            title="Eliminar"
                          >🗑️</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Create/Edit Modal ─── */}
      {showModal && (
        <ProductModal
          item={editItem}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditItem(null); }}
        />
      )}

      {/* ─── Delete Confirmation ─── */}
      {deleteConfirm && (
        <div className="crud-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="crud-modal crud-modal--sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="crud-modal__title">⚠️ Confirmar Eliminación</h2>
            <p className="crud-modal__text">¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
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
            <h2 className="crud-modal__title">📄 Reporte de Productos</h2>
            <div className="crud-modal__form">
              <div className="crud-modal__field">
                <label>Filtrar por Categoría</label>
                <select 
                  value={reportConfig.filter} 
                  onChange={(e) => setReportConfig({ ...reportConfig, filter: e.target.value })}
                >
                  <option value="all">Todas</option>
                  {CATEGORIES.map((cat) => cat.key !== 'all' && (
                    <option key={cat.key} value={cat.key}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="crud-modal__field">
                <label>Ordenar por</label>
                <select 
                  value={reportConfig.order} 
                  onChange={(e) => setReportConfig({ ...reportConfig, order: e.target.value })}
                >
                  <option value="name_asc">Nombre (A-Z)</option>
                  <option value="name_desc">Nombre (Z-A)</option>
                  <option value="price_desc">Precio (Mayor a menor)</option>
                  <option value="price_asc">Precio (Menor a mayor)</option>
                  <option value="stock_asc">Stock (Menor a mayor)</option>
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

/* ─── Product Modal Form ─── */
function ProductModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({
    name: item?.name || '',
    sku: item?.sku || '',
    category: item?.category || 'laptops',
    price: item?.price || '',
    cost: item?.cost || '',
    stock: item?.stock || '',
    minStock: item?.minStock || '',
    brand: item?.brand || '',
    description: item?.description || '',
    tags: item?.tags?.join(', ') || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      price: parseFloat(form.price) || 0,
      cost: parseFloat(form.cost) || 0,
      stock: parseInt(form.stock) || 0,
      minStock: parseInt(form.minStock) || 0,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="crud-modal-overlay" onClick={onClose}>
      <div className="crud-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="crud-modal__title">
          {item ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
        </h2>
        <form onSubmit={handleSubmit} className="crud-modal__form">
          <div className="crud-modal__row">
            <div className="crud-modal__field">
              <label>Nombre</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="crud-modal__field">
              <label>SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange} required />
            </div>
          </div>
          <div className="crud-modal__row">
            <div className="crud-modal__field">
              <label>Marca</label>
              <input name="brand" value={form.brand} onChange={handleChange} />
            </div>
            <div className="crud-modal__field">
              <label>Categoría</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.filter((c) => c.key !== 'all').map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="crud-modal__row">
            <div className="crud-modal__field">
              <label>Precio ($)</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
            </div>
            <div className="crud-modal__field">
              <label>Costo ($)</label>
              <input name="cost" type="number" step="0.01" value={form.cost} onChange={handleChange} />
            </div>
          </div>
          <div className="crud-modal__row">
            <div className="crud-modal__field">
              <label>Stock</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} required />
            </div>
            <div className="crud-modal__field">
              <label>Stock Mínimo</label>
              <input name="minStock" type="number" value={form.minStock} onChange={handleChange} />
            </div>
          </div>
          <div className="crud-modal__field">
            <label>Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          </div>
          <div className="crud-modal__field">
            <label>Tags (separados por coma)</label>
            <input name="tags" value={form.tags} onChange={handleChange} />
          </div>
          <div className="crud-modal__actions">
            <button type="button" className="crud-modal__btn crud-modal__btn--cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="crud-modal__btn crud-modal__btn--primary">
              {item ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
