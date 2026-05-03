/**
 * Mock Sales Data Service
 */

const TENANT_A = 'tenant_techstore_alpha';

const mockSales = [
  {
    id: 'sale_001', clientId: TENANT_A, sellerId: 'user_002', sellerName: 'María Vendedora',
    items: [
      { productId: 'prod_a_001', productName: 'MacBook Pro 16" M3 Max', quantity: 1, unitPrice: 3499.99, subtotal: 3499.99 },
      { productId: 'prod_a_006', productName: 'Logitech MX Master 3S', quantity: 2, unitPrice: 99.99, subtotal: 199.98 },
    ],
    totalAmount: 3699.97, paymentMethod: 'credit_card', status: 'completed',
    notes: 'Cliente corporativo', saleDate: new Date('2026-04-28T10:30:00'),
  },
  {
    id: 'sale_002', clientId: TENANT_A, sellerId: 'user_002', sellerName: 'María Vendedora',
    items: [
      { productId: 'prod_a_003', productName: 'Samsung Galaxy S24 Ultra', quantity: 1, unitPrice: 1299.99, subtotal: 1299.99 },
    ],
    totalAmount: 1299.99, paymentMethod: 'debit_card', status: 'completed',
    notes: '', saleDate: new Date('2026-04-29T14:15:00'),
  },
  {
    id: 'sale_003', clientId: TENANT_A, sellerId: 'user_001', sellerName: 'Carlos Administrador',
    items: [
      { productId: 'prod_a_002', productName: 'Sony WH-1000XM5', quantity: 3, unitPrice: 349.99, subtotal: 1049.97 },
      { productId: 'prod_a_007', productName: 'Samsung 990 Pro 2TB NVMe', quantity: 2, unitPrice: 179.99, subtotal: 359.98 },
    ],
    totalAmount: 1409.95, paymentMethod: 'transfer', status: 'completed',
    notes: 'Venta mayorista', saleDate: new Date('2026-04-30T09:00:00'),
  },
  {
    id: 'sale_004', clientId: TENANT_A, sellerId: 'user_002', sellerName: 'María Vendedora',
    items: [
      { productId: 'prod_a_004', productName: 'iPad Pro 12.9" M2', quantity: 1, unitPrice: 1099.99, subtotal: 1099.99 },
    ],
    totalAmount: 1099.99, paymentMethod: 'cash', status: 'pending',
    notes: 'Pendiente de retiro', saleDate: new Date('2026-05-01T16:45:00'),
  },
  {
    id: 'sale_005', clientId: TENANT_A, sellerId: 'user_001', sellerName: 'Carlos Administrador',
    items: [
      { productId: 'prod_a_005', productName: 'LG UltraGear 27GP950', quantity: 2, unitPrice: 799.99, subtotal: 1599.98 },
      { productId: 'prod_a_008', productName: 'ASUS ROG Rapture GT-AXE16000', quantity: 1, unitPrice: 649.99, subtotal: 649.99 },
    ],
    totalAmount: 2249.97, paymentMethod: 'credit_card', status: 'completed',
    notes: 'Setup gaming completo', saleDate: new Date('2026-05-02T11:20:00'),
  },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchSales(clientId) {
  await delay(350);
  return mockSales.filter((s) => s.clientId === clientId).sort((a, b) => b.saleDate - a.saleDate);
}

export async function fetchSaleStats(clientId) {
  await delay(250);
  const sales = mockSales.filter((s) => s.clientId === clientId);
  const completed = sales.filter((s) => s.status === 'completed');
  const totalRevenue = completed.reduce((s, v) => s + v.totalAmount, 0);
  const totalSales = completed.length;
  const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

  return {
    totalSales: sales.length,
    completedSales: totalSales,
    pendingSales: sales.filter((s) => s.status === 'pending').length,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    avgTicket: Math.round(avgTicket * 100) / 100,
  };
}

export const PAYMENT_METHODS = {
  cash: { label: 'Efectivo', icon: '💵' },
  credit_card: { label: 'Tarjeta Crédito', icon: '💳' },
  debit_card: { label: 'Tarjeta Débito', icon: '💳' },
  transfer: { label: 'Transferencia', icon: '🏦' },
  other: { label: 'Otro', icon: '📋' },
};

export const SALE_STATUS = {
  completed: { label: 'Completada', color: '#10b981' },
  pending: { label: 'Pendiente', color: '#f59e0b' },
  cancelled: { label: 'Cancelada', color: '#ef4444' },
  refunded: { label: 'Reembolsada', color: '#8b5cf6' },
};
