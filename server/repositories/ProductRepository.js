/**
 * ═══════════════════════════════════════════════════
 *  Product Repository — Repository Pattern
 * ═══════════════════════════════════════════════════
 * 
 * PATRÓN REPOSITORY:
 * ──────────────────
 * Este repositorio abstrae el acceso a datos de productos.
 * Actualmente trabaja con datos mock en memoria, pero
 * TODOS los métodos son async para que la migración a
 * Mongoose sea transparente:
 * 
 *   Antes (mock):
 *     async findAll(clientId) {
 *       return this.products.filter(p => p.clientId === clientId);
 *     }
 * 
 *   Después (Mongoose):
 *     async findAll(clientId) {
 *       return Product.find({ clientId, isActive: true });
 *     }
 * 
 * La capa de servicio NO cambia. Solo se modifica este
 * archivo para conectar con la base de datos real.
 * 
 * ═══════════════════════════════════════════════════
 */

// ─── IDs de Tenants de prueba ───
const TENANT_A = 'tenant_techstore_alpha';
const TENANT_B = 'tenant_techstore_beta';

// ─── Datos Mock de Tecnología ───
const mockProducts = [
  // ══════════════ TENANT A — TechStore Alpha ══════════════
  {
    id: 'prod_a_001',
    clientId: TENANT_A,
    name: 'MacBook Pro 16" M3 Max',
    sku: 'MBP-16-M3MAX-001',
    description: 'Laptop profesional con chip M3 Max, 36GB RAM, 1TB SSD. Pantalla Liquid Retina XDR.',
    category: 'laptops',
    price: 3499.99,
    cost: 2800.00,
    stock: 12,
    minStock: 3,
    imageUrl: 'https://picsum.photos/seed/macbook16/400/300',
    brand: 'Apple',
    isActive: true,
    tags: ['premium', 'profesional', 'apple-silicon'],
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-03-20'),
  },
  {
    id: 'prod_a_002',
    clientId: TENANT_A,
    name: 'Sony WH-1000XM5',
    sku: 'SONY-WH1000XM5-BLK',
    description: 'Audífonos over-ear con cancelación de ruido líder en la industria. Bluetooth 5.3.',
    category: 'audio',
    price: 349.99,
    cost: 220.00,
    stock: 45,
    minStock: 10,
    imageUrl: 'https://picsum.photos/seed/sonyxm5/400/300',
    brand: 'Sony',
    isActive: true,
    tags: ['audio', 'noise-cancelling', 'bluetooth'],
    createdAt: new Date('2025-02-10'),
    updatedAt: new Date('2025-04-01'),
  },
  {
    id: 'prod_a_003',
    clientId: TENANT_A,
    name: 'Samsung Galaxy S24 Ultra',
    sku: 'SAM-S24U-256-BLK',
    description: 'Smartphone insignia con S Pen integrado, cámara 200MP, pantalla AMOLED 6.8".',
    category: 'smartphones',
    price: 1299.99,
    cost: 950.00,
    stock: 28,
    minStock: 8,
    imageUrl: 'https://picsum.photos/seed/galaxys24/400/300',
    brand: 'Samsung',
    isActive: true,
    tags: ['flagship', 'android', 's-pen'],
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-03-15'),
  },
  {
    id: 'prod_a_004',
    clientId: TENANT_A,
    name: 'iPad Pro 12.9" M2',
    sku: 'IPAD-PRO-129-M2',
    description: 'Tablet profesional con chip M2, pantalla mini-LED, compatible con Apple Pencil 2.',
    category: 'tablets',
    price: 1099.99,
    cost: 850.00,
    stock: 18,
    minStock: 5,
    imageUrl: 'https://picsum.photos/seed/ipadpro/400/300',
    brand: 'Apple',
    isActive: true,
    tags: ['tablet', 'creative', 'apple'],
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-04-10'),
  },
  {
    id: 'prod_a_005',
    clientId: TENANT_A,
    name: 'LG UltraGear 27GP950',
    sku: 'LG-27GP950-B',
    description: 'Monitor gaming 4K 27" IPS, 160Hz, 1ms, HDMI 2.1, DisplayPort.',
    category: 'monitors',
    price: 799.99,
    cost: 580.00,
    stock: 7,
    minStock: 3,
    imageUrl: 'https://picsum.photos/seed/lgmonitor/400/300',
    brand: 'LG',
    isActive: true,
    tags: ['gaming', '4k', 'monitor'],
    createdAt: new Date('2025-02-28'),
    updatedAt: new Date('2025-03-25'),
  },
  {
    id: 'prod_a_006',
    clientId: TENANT_A,
    name: 'Logitech MX Master 3S',
    sku: 'LOG-MXM3S-GRY',
    description: 'Mouse ergonómico inalámbrico con sensor 8K DPI, scroll MagSpeed, USB-C.',
    category: 'accessories',
    price: 99.99,
    cost: 55.00,
    stock: 62,
    minStock: 15,
    imageUrl: 'https://picsum.photos/seed/mxmaster/400/300',
    brand: 'Logitech',
    isActive: true,
    tags: ['productividad', 'ergonómico', 'wireless'],
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-02-20'),
  },
  {
    id: 'prod_a_007',
    clientId: TENANT_A,
    name: 'Samsung 990 Pro 2TB NVMe',
    sku: 'SAM-990PRO-2TB',
    description: 'SSD NVMe PCIe 4.0, lectura 7450MB/s, escritura 6900MB/s.',
    category: 'storage',
    price: 179.99,
    cost: 110.00,
    stock: 35,
    minStock: 10,
    imageUrl: 'https://picsum.photos/seed/ssd990/400/300',
    brand: 'Samsung',
    isActive: true,
    tags: ['storage', 'nvme', 'alta-velocidad'],
    createdAt: new Date('2025-02-15'),
    updatedAt: new Date('2025-04-05'),
  },
  {
    id: 'prod_a_008',
    clientId: TENANT_A,
    name: 'ASUS ROG Rapture GT-AXE16000',
    sku: 'ASUS-GTAXE16000',
    description: 'Router WiFi 6E quad-band, 16000Mbps total, 2.5G WAN, cobertura 5000 sq ft.',
    category: 'networking',
    price: 649.99,
    cost: 420.00,
    stock: 4,
    minStock: 2,
    imageUrl: 'https://picsum.photos/seed/asusrouter/400/300',
    brand: 'ASUS',
    isActive: true,
    tags: ['networking', 'wifi6e', 'gaming'],
    createdAt: new Date('2025-03-10'),
    updatedAt: new Date('2025-04-15'),
  },

  // ══════════════ TENANT B — TechStore Beta ══════════════
  {
    id: 'prod_b_001',
    clientId: TENANT_B,
    name: 'ThinkPad X1 Carbon Gen 11',
    sku: 'LEN-X1C-G11-001',
    description: 'Ultrabook empresarial, Intel i7-1365U, 32GB RAM, pantalla 14" 2.8K OLED.',
    category: 'laptops',
    price: 2199.99,
    cost: 1700.00,
    stock: 15,
    minStock: 4,
    imageUrl: 'https://picsum.photos/seed/thinkpadx1/400/300',
    brand: 'Lenovo',
    isActive: true,
    tags: ['empresarial', 'ultrabook', 'oled'],
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-03-18'),
  },
  {
    id: 'prod_b_002',
    clientId: TENANT_B,
    name: 'Bose QuietComfort Ultra',
    sku: 'BOSE-QCU-BLK',
    description: 'Auriculares premium con Immersive Audio, cancelación de ruido adaptativa.',
    category: 'audio',
    price: 429.99,
    cost: 280.00,
    stock: 22,
    minStock: 6,
    imageUrl: 'https://picsum.photos/seed/boseqc/400/300',
    brand: 'Bose',
    isActive: true,
    tags: ['premium', 'spatial-audio', 'noise-cancelling'],
    createdAt: new Date('2025-02-05'),
    updatedAt: new Date('2025-04-02'),
  },
  {
    id: 'prod_b_003',
    clientId: TENANT_B,
    name: 'iPhone 15 Pro Max 256GB',
    sku: 'APL-IP15PM-256-TIT',
    description: 'Smartphone con chip A17 Pro, cámara 48MP con zoom óptico 5x, titanio natural.',
    category: 'smartphones',
    price: 1199.99,
    cost: 920.00,
    stock: 40,
    minStock: 10,
    imageUrl: 'https://picsum.photos/seed/iphone15pro/400/300',
    brand: 'Apple',
    isActive: true,
    tags: ['flagship', 'ios', 'titanio'],
    createdAt: new Date('2025-01-25'),
    updatedAt: new Date('2025-03-30'),
  },
  {
    id: 'prod_b_004',
    clientId: TENANT_B,
    name: 'Microsoft Surface Pro 9',
    sku: 'MS-SURFPRO9-i7',
    description: 'Tablet 2-en-1, Intel i7, 16GB RAM, pantalla 13" PixelSense, Windows 11 Pro.',
    category: 'tablets',
    price: 1599.99,
    cost: 1200.00,
    stock: 9,
    minStock: 3,
    imageUrl: 'https://picsum.photos/seed/surfacepro/400/300',
    brand: 'Microsoft',
    isActive: true,
    tags: ['2-en-1', 'empresarial', 'windows'],
    createdAt: new Date('2025-03-05'),
    updatedAt: new Date('2025-04-12'),
  },
  {
    id: 'prod_b_005',
    clientId: TENANT_B,
    name: 'Dell UltraSharp U2723QE',
    sku: 'DELL-U2723QE',
    description: 'Monitor 4K 27" IPS Black, USB-C 90W, calibración de fábrica, KVM integrado.',
    category: 'monitors',
    price: 619.99,
    cost: 430.00,
    stock: 14,
    minStock: 4,
    imageUrl: 'https://picsum.photos/seed/dellmonitor/400/300',
    brand: 'Dell',
    isActive: true,
    tags: ['profesional', '4k', 'usb-c'],
    createdAt: new Date('2025-02-20'),
    updatedAt: new Date('2025-03-28'),
  },
  {
    id: 'prod_b_006',
    clientId: TENANT_B,
    name: 'Razer DeathAdder V3 Pro',
    sku: 'RZR-DAV3PRO-BLK',
    description: 'Mouse gaming inalámbrico, sensor Focus Pro 30K, 63g ultraligero.',
    category: 'accessories',
    price: 149.99,
    cost: 85.00,
    stock: 55,
    minStock: 12,
    imageUrl: 'https://picsum.photos/seed/razermouse/400/300',
    brand: 'Razer',
    isActive: true,
    tags: ['gaming', 'esports', 'wireless'],
    createdAt: new Date('2025-01-18'),
    updatedAt: new Date('2025-02-25'),
  },
];

/**
 * ProductRepository
 * 
 * Todos los métodos son async para facilitar la migración
 * a Mongoose sin cambiar la interfaz del servicio.
 */
class ProductRepository {
  constructor() {
    // En memoria — será reemplazado por modelo Mongoose
    this.products = [...mockProducts];
  }

  /**
   * Obtener todos los productos de un tenant
   * @param {string} clientId - ID del tenant
   * @returns {Promise<Array>} Productos filtrados por tenant
   */
  async findAll(clientId) {
    // Mock: filtrar array en memoria
    // Mongoose: return Product.find({ clientId, isActive: true });
    return this.products.filter(
      (p) => p.clientId === clientId && p.isActive
    );
  }

  /**
   * Buscar un producto por ID dentro de un tenant
   * @param {string} clientId - ID del tenant
   * @param {string} productId - ID del producto
   * @returns {Promise<Object|null>}
   */
  async findById(clientId, productId) {
    // Mongoose: return Product.findOne({ _id: productId, clientId });
    return (
      this.products.find(
        (p) => p.id === productId && p.clientId === clientId
      ) || null
    );
  }

  /**
   * Buscar productos por categoría
   * @param {string} clientId 
   * @param {string} category 
   * @returns {Promise<Array>}
   */
  async findByCategory(clientId, category) {
    // Mongoose: return Product.find({ clientId, category, isActive: true });
    return this.products.filter(
      (p) =>
        p.clientId === clientId &&
        p.category === category &&
        p.isActive
    );
  }

  /**
   * Buscar productos con stock bajo
   * @param {string} clientId 
   * @returns {Promise<Array>}
   */
  async findLowStock(clientId) {
    // Mongoose: return Product.find({ clientId, $expr: { $lte: ['$stock', '$minStock'] } });
    return this.products.filter(
      (p) =>
        p.clientId === clientId &&
        p.stock <= p.minStock &&
        p.isActive
    );
  }

  /**
   * Crear un nuevo producto
   * @param {string} clientId 
   * @param {Object} productData 
   * @returns {Promise<Object>}
   */
  async create(clientId, productData) {
    // Mongoose: return Product.create({ ...productData, clientId });
    const newProduct = {
      id: `prod_${Date.now()}`,
      clientId,
      ...productData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  /**
   * Actualizar un producto existente
   * @param {string} clientId 
   * @param {string} productId 
   * @param {Object} updates 
   * @returns {Promise<Object|null>}
   */
  async update(clientId, productId, updates) {
    // Mongoose: return Product.findOneAndUpdate(
    //   { _id: productId, clientId },
    //   { $set: updates },
    //   { new: true }
    // );
    const index = this.products.findIndex(
      (p) => p.id === productId && p.clientId === clientId
    );
    if (index === -1) return null;

    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.products[index];
  }

  /**
   * Soft-delete de un producto
   * @param {string} clientId 
   * @param {string} productId 
   * @returns {Promise<boolean>}
   */
  async delete(clientId, productId) {
    // Mongoose: return Product.findOneAndUpdate(
    //   { _id: productId, clientId },
    //   { isActive: false }
    // );
    const product = await this.findById(clientId, productId);
    if (!product) return false;

    product.isActive = false;
    product.updatedAt = new Date();
    return true;
  }

  /**
   * Buscar productos por texto (nombre o descripción)
   * @param {string} clientId 
   * @param {string} searchTerm 
   * @returns {Promise<Array>}
   */
  async search(clientId, searchTerm) {
    // Mongoose: return Product.find({
    //   clientId,
    //   isActive: true,
    //   $or: [
    //     { name: { $regex: searchTerm, $options: 'i' } },
    //     { description: { $regex: searchTerm, $options: 'i' } },
    //   ],
    // });
    const term = searchTerm.toLowerCase();
    return this.products.filter(
      (p) =>
        p.clientId === clientId &&
        p.isActive &&
        (p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term))
    );
  }

  /**
   * Contar productos de un tenant
   * @param {string} clientId 
   * @returns {Promise<number>}
   */
  async count(clientId) {
    // Mongoose: return Product.countDocuments({ clientId, isActive: true });
    return this.products.filter(
      (p) => p.clientId === clientId && p.isActive
    ).length;
  }

  /**
   * Obtener estadísticas de inventario de un tenant
   * @param {string} clientId 
   * @returns {Promise<Object>}
   */
  async getStats(clientId) {
    const products = await this.findAll(clientId);
    const lowStock = await this.findLowStock(clientId);

    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const totalItems = products.reduce((sum, p) => sum + p.stock, 0);
    const categories = [...new Set(products.map((p) => p.category))];

    return {
      totalProducts: products.length,
      totalItems,
      totalValue: Math.round(totalValue * 100) / 100,
      lowStockCount: lowStock.length,
      categories: categories.length,
      avgPrice:
        products.length > 0
          ? Math.round(
              (products.reduce((sum, p) => sum + p.price, 0) / products.length) *
                100
            ) / 100
          : 0,
    };
  }
}

// Exportar instancia singleton
const productRepository = new ProductRepository();

module.exports = { ProductRepository, productRepository, TENANT_A, TENANT_B };
