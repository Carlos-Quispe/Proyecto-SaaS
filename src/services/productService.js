import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

/**
 * Mock Product Data Service
 * Simula las llamadas al backend — replica los datos del ProductRepository del server
 */

const TENANT_A = 'tenant_techstore_alpha';
const TENANT_B = 'tenant_techstore_beta';

const mockProducts = [
  // ═══ TENANT A — TechStore Alpha ═══
  {
    id: 'prod_a_001', clientId: TENANT_A,
    name: 'MacBook Pro 16" M3 Max',
    sku: 'MBP-16-M3MAX-001',
    description: 'Laptop profesional con chip M3 Max, 36GB RAM, 1TB SSD. Pantalla Liquid Retina XDR.',
    category: 'laptops', price: 3499.99, cost: 2800.00,
    stock: 12, minStock: 3,
    imageUrl: 'https://picsum.photos/seed/macbook16/400/300',
    brand: 'Apple', isActive: true,
    tags: ['premium', 'profesional', 'apple-silicon'],
  },
  {
    id: 'prod_a_002', clientId: TENANT_A,
    name: 'Sony WH-1000XM5',
    sku: 'SONY-WH1000XM5-BLK',
    description: 'Audífonos over-ear con cancelación de ruido líder en la industria. Bluetooth 5.3.',
    category: 'audio', price: 349.99, cost: 220.00,
    stock: 45, minStock: 10,
    imageUrl: 'https://picsum.photos/seed/sonyxm5/400/300',
    brand: 'Sony', isActive: true,
    tags: ['audio', 'noise-cancelling', 'bluetooth'],
  },
  {
    id: 'prod_a_003', clientId: TENANT_A,
    name: 'Samsung Galaxy S24 Ultra',
    sku: 'SAM-S24U-256-BLK',
    description: 'Smartphone insignia con S Pen integrado, cámara 200MP, pantalla AMOLED 6.8".',
    category: 'smartphones', price: 1299.99, cost: 950.00,
    stock: 28, minStock: 8,
    imageUrl: 'https://picsum.photos/seed/galaxys24/400/300',
    brand: 'Samsung', isActive: true,
    tags: ['flagship', 'android', 's-pen'],
  },
  {
    id: 'prod_a_004', clientId: TENANT_A,
    name: 'iPad Pro 12.9" M2',
    sku: 'IPAD-PRO-129-M2',
    description: 'Tablet profesional con chip M2, pantalla mini-LED, compatible con Apple Pencil 2.',
    category: 'tablets', price: 1099.99, cost: 850.00,
    stock: 18, minStock: 5,
    imageUrl: 'https://picsum.photos/seed/ipadpro/400/300',
    brand: 'Apple', isActive: true,
    tags: ['tablet', 'creative', 'apple'],
  },
  {
    id: 'prod_a_005', clientId: TENANT_A,
    name: 'LG UltraGear 27GP950',
    sku: 'LG-27GP950-B',
    description: 'Monitor gaming 4K 27" IPS, 160Hz, 1ms, HDMI 2.1.',
    category: 'monitors', price: 799.99, cost: 580.00,
    stock: 7, minStock: 3,
    imageUrl: 'https://picsum.photos/seed/lgmonitor/400/300',
    brand: 'LG', isActive: true,
    tags: ['gaming', '4k', 'monitor'],
  },
  {
    id: 'prod_a_006', clientId: TENANT_A,
    name: 'Logitech MX Master 3S',
    sku: 'LOG-MXM3S-GRY',
    description: 'Mouse ergonómico inalámbrico con sensor 8K DPI, scroll MagSpeed.',
    category: 'accessories', price: 99.99, cost: 55.00,
    stock: 62, minStock: 15,
    imageUrl: 'https://picsum.photos/seed/mxmaster/400/300',
    brand: 'Logitech', isActive: true,
    tags: ['productividad', 'ergonómico', 'wireless'],
  },
  {
    id: 'prod_a_007', clientId: TENANT_A,
    name: 'Samsung 990 Pro 2TB NVMe',
    sku: 'SAM-990PRO-2TB',
    description: 'SSD NVMe PCIe 4.0, lectura 7450MB/s, escritura 6900MB/s.',
    category: 'storage', price: 179.99, cost: 110.00,
    stock: 35, minStock: 10,
    imageUrl: 'https://picsum.photos/seed/ssd990/400/300',
    brand: 'Samsung', isActive: true,
    tags: ['storage', 'nvme', 'alta-velocidad'],
  },
  {
    id: 'prod_a_008', clientId: TENANT_A,
    name: 'ASUS ROG Rapture GT-AXE16000',
    sku: 'ASUS-GTAXE16000',
    description: 'Router WiFi 6E quad-band, 16000Mbps total.',
    category: 'networking', price: 649.99, cost: 420.00,
    stock: 4, minStock: 2,
    imageUrl: 'https://picsum.photos/seed/asusrouter/400/300',
    brand: 'ASUS', isActive: true,
    tags: ['networking', 'wifi6e', 'gaming'],
  },
  {
    id: 'prod_a_009', clientId: TENANT_A,
    name: 'NVIDIA GeForce RTX 4090',
    sku: 'GPU-NV-4090',
    description: 'Tarjeta gráfica premium con 24GB GDDR6X.',
    category: 'accessories', price: 1599.99, cost: 1400.00,
    stock: 5, minStock: 2,
    imageUrl: 'https://picsum.photos/seed/rtx4090/400/300',
    brand: 'NVIDIA', isActive: true,
    tags: ['gpu', 'gaming', 'premium'],
  },
  {
    id: 'prod_a_010', clientId: TENANT_A,
    name: 'Corsair Vengeance RGB 32GB DDR5',
    sku: 'MEM-COR-32DDR5',
    description: 'Memoria RAM DDR5 6000MHz (2x16GB) con iluminación RGB.',
    category: 'accessories', price: 149.99, cost: 90.00,
    stock: 20, minStock: 5,
    imageUrl: 'https://picsum.photos/seed/corsairddr5/400/300',
    brand: 'Corsair', isActive: true,
    tags: ['ram', 'ddr5', 'gaming'],
  },
  {
    id: 'prod_a_011', clientId: TENANT_A,
    name: 'Dell XPS 15 9530',
    sku: 'DELL-XPS15-9530',
    description: 'Laptop premium con Intel Core i9 y pantalla OLED.',
    category: 'laptops', price: 2399.99, cost: 1800.00,
    stock: 8, minStock: 2,
    imageUrl: 'https://picsum.photos/seed/dellxps15/400/300',
    brand: 'Dell', isActive: true,
    tags: ['laptop', 'premium', 'windows'],
  },
  {
    id: 'prod_a_012', clientId: TENANT_A,
    name: 'Keychron Q1 Pro',
    sku: 'KB-KEYC-Q1PRO',
    description: 'Teclado mecánico custom inalámbrico 75% aluminio.',
    category: 'accessories', price: 199.99, cost: 120.00,
    stock: 15, minStock: 5,
    imageUrl: 'https://picsum.photos/seed/keychronq1/400/300',
    brand: 'Keychron', isActive: true,
    tags: ['teclado', 'mecanico', 'inalambrico'],
  },
  {
    id: 'prod_a_013', clientId: TENANT_A,
    name: 'Samsung Odyssey Neo G9',
    sku: 'SAM-OD-NEOG9',
    description: 'Monitor gaming curvo de 49" Mini LED 240Hz.',
    category: 'monitors', price: 1799.99, cost: 1300.00,
    stock: 3, minStock: 1,
    imageUrl: 'https://picsum.photos/seed/samsungneog9/400/300',
    brand: 'Samsung', isActive: true,
    tags: ['monitor', 'gaming', 'ultrawide'],
  },
  {
    id: 'prod_a_014', clientId: TENANT_A,
    name: 'Apple Watch Ultra 2',
    sku: 'AW-ULTRA2',
    description: 'Reloj inteligente de titanio con GPS y conectividad celular.',
    category: 'accessories', price: 799.99, cost: 550.00,
    stock: 14, minStock: 4,
    imageUrl: 'https://picsum.photos/seed/awultra2/400/300',
    brand: 'Apple', isActive: true,
    tags: ['smartwatch', 'apple', 'fitness'],
  },
  {
    id: 'prod_a_015', clientId: TENANT_A,
    name: 'Sony a7 IV',
    sku: 'CAM-SONY-A7IV',
    description: 'Cámara Mirrorless Full-Frame 33MP.',
    category: 'accessories', price: 2499.99, cost: 1900.00,
    stock: 6, minStock: 2,
    imageUrl: 'https://picsum.photos/seed/sonya7iv/400/300',
    brand: 'Sony', isActive: true,
    tags: ['camara', 'fotografia', 'mirrorless'],
  },
  {
    id: 'prod_a_016', clientId: TENANT_A,
    name: 'Google Pixel 8 Pro',
    sku: 'GOOG-PIX8P',
    description: 'Smartphone con IA integrada y cámara avanzada 50MP.',
    category: 'smartphones', price: 999.99, cost: 650.00,
    stock: 18, minStock: 5,
    imageUrl: 'https://picsum.photos/seed/pixel8pro/400/300',
    brand: 'Google', isActive: true,
    tags: ['smartphone', 'android', 'ai'],
  },
  {
    id: 'prod_a_017', clientId: TENANT_A,
    name: 'WD Black SN850X 1TB',
    sku: 'SSD-WD-SN850X',
    description: 'SSD NVMe para PC y PS5 de alta velocidad.',
    category: 'storage', price: 89.99, cost: 50.00,
    stock: 40, minStock: 10,
    imageUrl: 'https://picsum.photos/seed/wdsn850x/400/300',
    brand: 'Western Digital', isActive: true,
    tags: ['ssd', 'almacenamiento', 'gaming'],
  },
  {
    id: 'prod_a_018', clientId: TENANT_A,
    name: 'Anker 737 Power Bank',
    sku: 'PB-ANK-737',
    description: 'Batería externa de 24,000mAh con carga rápida 140W.',
    category: 'accessories', price: 149.99, cost: 80.00,
    stock: 25, minStock: 8,
    imageUrl: 'https://picsum.photos/seed/anker737/400/300',
    brand: 'Anker', isActive: true,
    tags: ['bateria', 'portatil', 'carga-rapida'],
  },

  // ═══ TENANT B — TechStore Beta ═══
  {
    id: 'prod_b_001', clientId: TENANT_B,
    name: 'ThinkPad X1 Carbon Gen 11',
    sku: 'LEN-X1C-G11-001',
    description: 'Ultrabook empresarial, Intel i7-1365U, 32GB RAM, pantalla 14" 2.8K OLED.',
    category: 'laptops', price: 2199.99, cost: 1700.00,
    stock: 15, minStock: 4,
    imageUrl: 'https://picsum.photos/seed/thinkpadx1/400/300',
    brand: 'Lenovo', isActive: true,
    tags: ['empresarial', 'ultrabook', 'oled'],
  },
  {
    id: 'prod_b_002', clientId: TENANT_B,
    name: 'Bose QuietComfort Ultra',
    sku: 'BOSE-QCU-BLK',
    description: 'Auriculares premium con Immersive Audio, cancelación de ruido adaptativa.',
    category: 'audio', price: 429.99, cost: 280.00,
    stock: 22, minStock: 6,
    imageUrl: 'https://picsum.photos/seed/boseqc/400/300',
    brand: 'Bose', isActive: true,
    tags: ['premium', 'spatial-audio', 'noise-cancelling'],
  },
  {
    id: 'prod_b_003', clientId: TENANT_B,
    name: 'iPhone 15 Pro Max 256GB',
    sku: 'APL-IP15PM-256-TIT',
    description: 'Smartphone con chip A17 Pro, cámara 48MP con zoom óptico 5x, titanio natural.',
    category: 'smartphones', price: 1199.99, cost: 920.00,
    stock: 40, minStock: 10,
    imageUrl: 'https://picsum.photos/seed/iphone15pro/400/300',
    brand: 'Apple', isActive: true,
    tags: ['flagship', 'ios', 'titanio'],
  },
  {
    id: 'prod_b_004', clientId: TENANT_B,
    name: 'Microsoft Surface Pro 9',
    sku: 'MS-SURFPRO9-i7',
    description: 'Tablet 2-en-1, Intel i7, 16GB RAM, pantalla 13" PixelSense.',
    category: 'tablets', price: 1599.99, cost: 1200.00,
    stock: 9, minStock: 3,
    imageUrl: 'https://picsum.photos/seed/surfacepro/400/300',
    brand: 'Microsoft', isActive: true,
    tags: ['2-en-1', 'empresarial', 'windows'],
  },
  {
    id: 'prod_b_005', clientId: TENANT_B,
    name: 'Dell UltraSharp U2723QE',
    sku: 'DELL-U2723QE',
    description: 'Monitor 4K 27" IPS Black, USB-C 90W, KVM integrado.',
    category: 'monitors', price: 619.99, cost: 430.00,
    stock: 14, minStock: 4,
    imageUrl: 'https://picsum.photos/seed/dellmonitor/400/300',
    brand: 'Dell', isActive: true,
    tags: ['profesional', '4k', 'usb-c'],
  },
  {
    id: 'prod_b_006', clientId: TENANT_B,
    name: 'Razer DeathAdder V3 Pro',
    sku: 'RZR-DAV3PRO-BLK',
    description: 'Mouse gaming inalámbrico, sensor Focus Pro 30K, 63g ultraligero.',
    category: 'accessories', price: 149.99, cost: 85.00,
    stock: 55, minStock: 12,
    imageUrl: 'https://picsum.photos/seed/razermouse/400/300',
    brand: 'Razer', isActive: true,
    tags: ['gaming', 'esports', 'wireless'],
  },
  {
    id: 'prod_b_007', clientId: TENANT_B,
    name: 'Asus ROG Zephyrus G14',
    sku: 'ASUS-ROG-G14',
    description: 'Laptop gaming ultraligera con AMD Ryzen 9 y RTX 4070.',
    category: 'laptops', price: 1699.99, cost: 1300.00,
    stock: 10, minStock: 3,
    imageUrl: 'https://picsum.photos/seed/zephyrusg14/400/300',
    brand: 'Asus', isActive: true,
    tags: ['laptop', 'gaming', 'ligero'],
  },
  {
    id: 'prod_b_008', clientId: TENANT_B,
    name: 'Apple AirPods Pro 2',
    sku: 'APP-AIRPRO2',
    description: 'Audífonos in-ear con cancelación de ruido y audio espacial.',
    category: 'audio', price: 249.99, cost: 150.00,
    stock: 50, minStock: 15,
    imageUrl: 'https://picsum.photos/seed/airpodspro2/400/300',
    brand: 'Apple', isActive: true,
    tags: ['audifonos', 'apple', 'noise-cancelling'],
  },
  {
    id: 'prod_b_009', clientId: TENANT_B,
    name: 'Samsung Galaxy Tab S9 Ultra',
    sku: 'SAM-TAB-S9U',
    description: 'Tablet premium de 14.6" AMOLED, S-Pen incluido.',
    category: 'tablets', price: 1199.99, cost: 850.00,
    stock: 7, minStock: 2,
    imageUrl: 'https://picsum.photos/seed/tabs9ultra/400/300',
    brand: 'Samsung', isActive: true,
    tags: ['tablet', 'android', 'premium'],
  },
  {
    id: 'prod_b_010', clientId: TENANT_B,
    name: 'Logitech MX Keys S',
    sku: 'KB-LOG-MXKEYS',
    description: 'Teclado inalámbrico avanzado para productividad.',
    category: 'accessories', price: 109.99, cost: 65.00,
    stock: 30, minStock: 8,
    imageUrl: 'https://picsum.photos/seed/mxkeys/400/300',
    brand: 'Logitech', isActive: true,
    tags: ['teclado', 'productividad', 'inalambrico'],
  },
  {
    id: 'prod_b_011', clientId: TENANT_B,
    name: 'Seagate FireCuda 530 2TB',
    sku: 'SSD-SEA-FIRE530',
    description: 'Unidad de estado sólido M.2 PCIe Gen4.',
    category: 'storage', price: 169.99, cost: 100.00,
    stock: 12, minStock: 4,
    imageUrl: 'https://picsum.photos/seed/firecuda/400/300',
    brand: 'Seagate', isActive: true,
    tags: ['ssd', 'almacenamiento', 'pcie4'],
  },
  {
    id: 'prod_b_012', clientId: TENANT_B,
    name: 'LG C3 42" OLED',
    sku: 'TV-LG-C3-42',
    description: 'Smart TV OLED Evo 4K ideal como monitor gaming.',
    category: 'monitors', price: 999.99, cost: 750.00,
    stock: 5, minStock: 2,
    imageUrl: 'https://picsum.photos/seed/lgc3oled/400/300',
    brand: 'LG', isActive: true,
    tags: ['tv', 'oled', '4k'],
  },
  {
    id: 'prod_b_013', clientId: TENANT_B,
    name: 'Netgear Nighthawk AX12',
    sku: 'ROUT-NET-AX12',
    description: 'Router WiFi 6 de alto rendimiento para gaming y streaming.',
    category: 'networking', price: 399.99, cost: 250.00,
    stock: 8, minStock: 3,
    imageUrl: 'https://picsum.photos/seed/nighthawk/400/300',
    brand: 'Netgear', isActive: true,
    tags: ['router', 'wifi6', 'networking'],
  },
  {
    id: 'prod_b_014', clientId: TENANT_B,
    name: 'HyperX Cloud III Wireless',
    sku: 'AUD-HYP-CLD3',
    description: 'Auriculares gaming inalámbricos con batería de 120 horas.',
    category: 'audio', price: 169.99, cost: 95.00,
    stock: 22, minStock: 6,
    imageUrl: 'https://picsum.photos/seed/hyperxcloud3/400/300',
    brand: 'HyperX', isActive: true,
    tags: ['headset', 'gaming', 'inalambrico'],
  },
  {
    id: 'prod_b_015', clientId: TENANT_B,
    name: 'OnePlus 12',
    sku: 'ONE-PLUS12',
    description: 'Smartphone flagship killer con Snapdragon 8 Gen 3.',
    category: 'smartphones', price: 799.99, cost: 580.00,
    stock: 15, minStock: 4,
    imageUrl: 'https://picsum.photos/seed/oneplus12/400/300',
    brand: 'OnePlus', isActive: true,
    tags: ['smartphone', 'android', 'flagship'],
  },
  {
    id: 'prod_b_016', clientId: TENANT_B,
    name: 'Elgato Stream Deck MK.2',
    sku: 'ACC-ELG-SD2',
    description: 'Controlador para creadores de contenido con 15 teclas LCD.',
    category: 'accessories', price: 149.99, cost: 85.00,
    stock: 18, minStock: 5,
    imageUrl: 'https://picsum.photos/seed/streamdeck/400/300',
    brand: 'Elgato', isActive: true,
    tags: ['streaming', 'creador', 'controlador'],
  },
];

// Simular latencia de red en modo mock
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function mapProduct(row) {
  return {
    id: row.id,
    clientId: row.tenant_id,
    name: row.name,
    sku: row.sku,
    description: row.description || '',
    category: row.category,
    price: Number(row.price || 0),
    cost: Number(row.cost || 0),
    stock: Number(row.stock || 0),
    minStock: Number(row.min_stock || 0),
    imageUrl: row.image_url || `https://picsum.photos/seed/${row.id}/400/300`,
    brand: row.brand || '',
    isActive: row.is_active,
    tags: row.tags || [],
  };
}

function toProductRow(product, tenantId) {
  const row = {
    tenant_id: tenantId,
    name: product.name,
    sku: product.sku,
    description: product.description || '',
    category: product.category,
    price: product.price || 0,
    cost: product.cost || 0,
    stock: product.stock || 0,
    min_stock: product.minStock || 0,
    image_url: product.imageUrl || `https://picsum.photos/seed/${product.sku || Date.now()}/400/300`,
    brand: product.brand || '',
    is_active: product.isActive ?? true,
    tags: Array.isArray(product.tags) ? product.tags : [],
  };
  if (!tenantId) delete row.tenant_id;
  return row;
}

export async function fetchProducts(clientId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', clientId)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapProduct);
  }

  await delay(400);
  return mockProducts.filter((p) => p.clientId === clientId && p.isActive);
}

export async function fetchProductStats(clientId) {
  if (!isSupabaseConfigured) await delay(300);
  const products = await fetchProducts(clientId);
  const lowStock = products.filter((p) => p.stock <= p.minStock);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalItems = products.reduce((sum, p) => sum + p.stock, 0);

  return {
    totalProducts: products.length,
    totalItems,
    totalValue: Math.round(totalValue * 100) / 100,
    lowStockCount: lowStock.length,
    categories: [...new Set(products.map((p) => p.category))].length,
    avgPrice: products.length > 0
      ? Math.round((products.reduce((s, p) => s + p.price, 0) / products.length) * 100) / 100
      : 0,
  };
}

export async function searchProducts(clientId, term) {
  if (!isSupabaseConfigured) await delay(250);
  const lower = term.toLowerCase();
  const products = await fetchProducts(clientId);
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.sku.toLowerCase().includes(lower)
  );
}

export async function createProduct(clientId, product) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('products')
      .insert(toProductRow(product, clientId))
      .select('*')
      .single();

    if (error) throw error;
    return mapProduct(data);
  }

  await delay(250);
  return {
    ...product,
    id: `prod_new_${Date.now()}`,
    clientId,
    isActive: true,
    imageUrl: product.imageUrl || `https://picsum.photos/seed/${Date.now()}/400/300`,
  };
}

export async function updateProduct(productId, product) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('products')
      .update(toProductRow(product, product.clientId))
      .eq('id', productId)
      .select('*')
      .single();

    if (error) throw error;
    return mapProduct(data);
  }

  await delay(250);
  return { ...product, id: productId };
}

export async function deleteProduct(productId) {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', productId);

    if (error) throw error;
    return true;
  }

  await delay(200);
  return true;
}

export const CATEGORIES = [
  { key: 'all', label: 'Todos', icon: '📦' },
  { key: 'laptops', label: 'Laptops', icon: '💻' },
  { key: 'smartphones', label: 'Smartphones', icon: '📱' },
  { key: 'tablets', label: 'Tablets', icon: '📋' },
  { key: 'audio', label: 'Audio', icon: '🎧' },
  { key: 'monitors', label: 'Monitores', icon: '🖥️' },
  { key: 'accessories', label: 'Accesorios', icon: '🖱️' },
  { key: 'storage', label: 'Almacenamiento', icon: '💾' },
  { key: 'networking', label: 'Redes', icon: '📡' },
];
