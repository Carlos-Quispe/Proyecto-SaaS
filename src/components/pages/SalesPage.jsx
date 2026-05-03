import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { fetchSales, PAYMENT_METHODS, SALE_STATUS } from '../../services/salesService';
import { fetchProducts } from '../../services/productService';
import { generatePdf } from '../../services/pdfService';
import FeedbackToast from '../FeedbackToast';
import './CrudPage.css';

function dateInputToLocalDate(value, endOfDay = false) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(
    year,
    month - 1,
    day,
    endOfDay ? 23 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 999 : 0,
  );
}

function formatSaleDate(date) {
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function SalesPage() {
  const { currentTenant } = useTenant();
  const { isAdmin, user } = useAuth();
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortOrder, setSortOrder] = useState('date_desc');
  const [toast, setToast] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [loadedSales, loadedProducts] = await Promise.all([
        fetchSales(currentTenant.id),
        fetchProducts(currentTenant.id),
      ]);
      setSales(loadedSales);
      setProducts(loadedProducts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentTenant.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    const from = dateInputToLocalDate(dateFrom);
    const to = dateInputToLocalDate(dateTo, true);

    const result = sales.filter((sale) => {
      const matchStatus = statusFilter === 'all' || sale.status === statusFilter;
      const matchFrom = !from || sale.saleDate >= from;
      const matchTo = !to || sale.saleDate <= to;
      return matchStatus && matchFrom && matchTo;
    });

    result.sort((a, b) => {
      if (sortOrder === 'date_asc') return a.saleDate - b.saleDate;
      if (sortOrder === 'amount_desc') return b.totalAmount - a.totalAmount;
      if (sortOrder === 'amount_asc') return a.totalAmount - b.totalAmount;
      return b.saleDate - a.saleDate;
    });

    return result;
  }, [sales, statusFilter, dateFrom, dateTo, sortOrder]);

  const hasActiveFilters = Boolean(statusFilter !== 'all' || dateFrom || dateTo);

  const handleGenerateReport = () => {
    const columns = ['ID', 'Fecha', 'Vendedor', 'Productos', 'Total', 'Estado'];
    const data = filtered.map((sale) => [
      sale.id,
      formatSaleDate(sale.saleDate),
      sale.sellerName,
      sale.items.map((item) => `${item.productName} (x${item.quantity})`).join(', '),
      `$${sale.totalAmount.toLocaleString()}`,
      SALE_STATUS[sale.status]?.label || sale.status,
    ]);

    generatePdf('Reporte de Ventas', columns, data, `ventas_${Date.now()}.pdf`);
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    setSortOrder('date_desc');
  };

  const handleSave = (formData) => {
    const selectedProduct = products.find((product) => product.id === formData.productId);
    const quantity = parseInt(formData.quantity) || 1;
    const unitPrice = selectedProduct?.price || 0;
    const newSale = {
      id: `sale_${Date.now()}`,
      clientId: currentTenant.id,
      sellerId: user.id,
      sellerName: user.name,
      items: [{
        productId: formData.productId,
        productName: selectedProduct?.name || 'Producto',
        quantity,
        unitPrice,
        subtotal: unitPrice * quantity,
      }],
      totalAmount: unitPrice * quantity,
      paymentMethod: formData.paymentMethod,
      status: 'pending',
      notes: formData.notes,
      saleDate: new Date(),
    };
    setSales((prev) => [newSale, ...prev]);
    setShowModal(false);
    setToast({
      title: 'Venta registrada',
      message: `Venta ${newSale.id} agregada por ${newSale.sellerName}.`,
      type: 'success',
    });
  };

  const handleDelete = (id) => {
    const sale = sales.find((item) => item.id === id);
    setSales((prev) => prev.filter((sale) => sale.id !== id));
    setDeleteConfirm(null);
    setToast({
      title: 'Venta eliminada',
      message: `${sale?.id || 'La venta'} fue eliminada del registro.`,
      type: 'danger',
    });
  };

  return (
    <div className="crud-page" id="sales-page">
      <header className="crud-page__header">
        <div>
          <h1 className="crud-page__title">Ventas</h1>
          <p className="crud-page__desc">Registro y gestion de ventas</p>
        </div>
        <div className="crud-page__header-actions">
          <button className="crud-page__btn-secondary" onClick={handleGenerateReport}>
            Descargar reporte
          </button>
          <button
            className="crud-page__add-btn"
            onClick={() => setShowModal(true)}
            id="add-sale-btn"
          >
            + Nueva Venta
          </button>
        </div>
      </header>

      <div className="crud-page__filters">
        <div className="crud-page__filter-row">
          <div className="crud-page__filter-field">
            <label>Fecha desde</label>
            <input
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="crud-page__filter-field">
            <label>Fecha hasta</label>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div className="crud-page__filter-field">
            <label>Ordenar por</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="date_desc">Fecha (mas recientes primero)</option>
              <option value="date_asc">Fecha (mas antiguos primero)</option>
              <option value="amount_desc">Monto (mayor a menor)</option>
              <option value="amount_asc">Monto (menor a mayor)</option>
            </select>
          </div>
          <div className="crud-page__filter-summary">
            <span>{filtered.length} venta{filtered.length !== 1 ? 's' : ''}</span>
            {hasActiveFilters && (
              <button type="button" onClick={handleClearFilters}>
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        <div className="crud-page__filter-pills">
          <button
            className={`crud-page__pill ${statusFilter === 'all' ? 'crud-page__pill--active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            Todas
          </button>
          {Object.entries(SALE_STATUS).map(([key, val]) => (
            <button
              key={key}
              className={`crud-page__pill ${statusFilter === key ? 'crud-page__pill--active' : ''}`}
              onClick={() => setStatusFilter(key)}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="crud-page__loading">
          <span className="crud-page__spinner" />
          Cargando ventas...
        </div>
      ) : (
        <div className="crud-page__table-wrap">
          <table className="crud-table" id="sales-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Vendedor</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Metodo</th>
                <th>Estado</th>
                {isAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="crud-table__empty">
                    No hay ventas para los filtros seleccionados
                  </td>
                </tr>
              ) : (
                filtered.map((sale) => (
                  <tr key={sale.id} className="crud-table__row">
                    <td><code className="crud-table__sku">{sale.id}</code></td>
                    <td>{formatSaleDate(sale.saleDate)}</td>
                    <td>{sale.sellerName}</td>
                    <td>
                      {sale.items.map((item, i) => (
                        <div key={i} style={{ fontSize: '0.75rem' }}>
                          {item.productName} x{item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="crud-table__price">${sale.totalAmount.toLocaleString()}</td>
                    <td>
                      {PAYMENT_METHODS[sale.paymentMethod]?.icon} {PAYMENT_METHODS[sale.paymentMethod]?.label}
                    </td>
                    <td>
                      <span className={`crud-table__status crud-table__status--${sale.status}`}>
                        {SALE_STATUS[sale.status]?.label}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        <div className="crud-table__actions">
                          <button
                            className="crud-table__action-btn crud-table__action-btn--delete"
                            onClick={() => setDeleteConfirm(sale.id)}
                            title="Eliminar"
                          >
                            X
                          </button>
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

      {showModal && (
        <SaleModal
          products={products}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {deleteConfirm && (
        <div className="crud-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="crud-modal crud-modal--sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="crud-modal__title">Confirmar eliminacion</h2>
            <p className="crud-modal__text">Eliminar esta venta?</p>
            <div className="crud-modal__actions">
              <button className="crud-modal__btn crud-modal__btn--cancel" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button className="crud-modal__btn crud-modal__btn--danger" onClick={() => handleDelete(deleteConfirm)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
      <FeedbackToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function SaleModal({ products, onSave, onClose }) {
  const [form, setForm] = useState({
    productId: products[0]?.id || '',
    quantity: 1,
    paymentMethod: 'cash',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const selectedProduct = products.find((product) => product.id === form.productId);
  const subtotal = (selectedProduct?.price || 0) * (parseInt(form.quantity) || 0);

  return (
    <div className="crud-modal-overlay" onClick={onClose}>
      <div className="crud-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="crud-modal__title">Nueva Venta</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="crud-modal__form">
          <div className="crud-modal__field">
            <label>Producto</label>
            <select name="productId" value={form.productId} onChange={handleChange}>
              {products.map((product) => (
                <option key={product.id} value={product.id}>{product.name} - ${product.price}</option>
              ))}
            </select>
          </div>
          <div className="crud-modal__row">
            <div className="crud-modal__field">
              <label>Cantidad</label>
              <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} />
            </div>
            <div className="crud-modal__field">
              <label>Metodo de Pago</label>
              <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                  <option key={key} value={key}>{value.icon} {value.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="crud-modal__field">
            <label>Notas</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} />
          </div>
          <div style={{ textAlign: 'right', fontSize: '1.1rem', fontWeight: 800, color: '#a5b4fc', margin: '0.5rem 0' }}>
            Total: ${subtotal.toLocaleString()}
          </div>
          <div className="crud-modal__actions">
            <button type="button" className="crud-modal__btn crud-modal__btn--cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="crud-modal__btn crud-modal__btn--primary">Registrar Venta</button>
          </div>
        </form>
      </div>
    </div>
  );
}
