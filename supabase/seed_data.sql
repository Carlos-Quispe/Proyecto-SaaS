-- ============================================================
-- SEED DATA — Stock Manager SaaS
-- Ejecuta en el SQL Editor de Supabase DESPUÉS del schema.sql
-- ============================================================

-- ─── PRODUCTOS — TechStore Alpha ───────────────────────────

insert into public.products (id, tenant_id, name, sku, description, category, price, cost, stock, min_stock, image_url, brand, is_active, tags)
values
  ('a0000001-0000-0000-0000-000000000001', 'tenant_techstore_alpha', 'MacBook Pro 16" M3 Max', 'MBP-16-M3MAX-001', 'Laptop profesional con chip M3 Max, 36GB RAM, 1TB SSD. Pantalla Liquid Retina XDR.', 'laptops', 3499.99, 2800.00, 12, 3, 'https://picsum.photos/seed/macbook16/400/300', 'Apple', true, ARRAY['premium','profesional','apple-silicon']),
  ('a0000001-0000-0000-0000-000000000002', 'tenant_techstore_alpha', 'Sony WH-1000XM5', 'SONY-WH1000XM5-BLK', 'Audifonos over-ear con cancelacion de ruido lider en la industria. Bluetooth 5.3.', 'audio', 349.99, 220.00, 45, 10, 'https://picsum.photos/seed/sonyxm5/400/300', 'Sony', true, ARRAY['audio','noise-cancelling','bluetooth']),
  ('a0000001-0000-0000-0000-000000000003', 'tenant_techstore_alpha', 'Samsung Galaxy S24 Ultra', 'SAM-S24U-256-BLK', 'Smartphone insignia con S Pen integrado, camara 200MP, pantalla AMOLED 6.8".', 'smartphones', 1299.99, 950.00, 28, 8, 'https://picsum.photos/seed/galaxys24/400/300', 'Samsung', true, ARRAY['flagship','android','s-pen']),
  ('a0000001-0000-0000-0000-000000000004', 'tenant_techstore_alpha', 'iPad Pro 12.9" M2', 'IPAD-PRO-129-M2', 'Tablet profesional con chip M2, pantalla mini-LED, compatible con Apple Pencil 2.', 'tablets', 1099.99, 850.00, 18, 5, 'https://picsum.photos/seed/ipadpro/400/300', 'Apple', true, ARRAY['tablet','creative','apple']),
  ('a0000001-0000-0000-0000-000000000005', 'tenant_techstore_alpha', 'LG UltraGear 27GP950', 'LG-27GP950-B', 'Monitor gaming 4K 27" IPS, 160Hz, 1ms, HDMI 2.1.', 'monitors', 799.99, 580.00, 7, 3, 'https://picsum.photos/seed/lgmonitor/400/300', 'LG', true, ARRAY['gaming','4k','monitor']),
  ('a0000001-0000-0000-0000-000000000006', 'tenant_techstore_alpha', 'Logitech MX Master 3S', 'LOG-MXM3S-GRY', 'Mouse ergonomico inalambrico con sensor 8K DPI, scroll MagSpeed.', 'accessories', 99.99, 55.00, 62, 15, 'https://picsum.photos/seed/mxmaster/400/300', 'Logitech', true, ARRAY['productividad','ergonomico','wireless']),
  ('a0000001-0000-0000-0000-000000000007', 'tenant_techstore_alpha', 'Samsung 990 Pro 2TB NVMe', 'SAM-990PRO-2TB', 'SSD NVMe PCIe 4.0, lectura 7450MB/s, escritura 6900MB/s.', 'storage', 179.99, 110.00, 35, 10, 'https://picsum.photos/seed/ssd990/400/300', 'Samsung', true, ARRAY['storage','nvme','alta-velocidad']),
  ('a0000001-0000-0000-0000-000000000008', 'tenant_techstore_alpha', 'ASUS ROG Rapture GT-AXE16000', 'ASUS-GTAXE16000', 'Router WiFi 6E quad-band, 16000Mbps total.', 'networking', 649.99, 420.00, 4, 2, 'https://picsum.photos/seed/asusrouter/400/300', 'ASUS', true, ARRAY['networking','wifi6e','gaming']),
  ('a0000001-0000-0000-0000-000000000009', 'tenant_techstore_alpha', 'NVIDIA GeForce RTX 4090', 'GPU-NV-4090', 'Tarjeta grafica premium con 24GB GDDR6X.', 'accessories', 1599.99, 1400.00, 5, 2, 'https://picsum.photos/seed/rtx4090/400/300', 'NVIDIA', true, ARRAY['gpu','gaming','premium']),
  ('a0000001-0000-0000-0000-000000000010', 'tenant_techstore_alpha', 'Corsair Vengeance RGB 32GB DDR5', 'MEM-COR-32DDR5', 'Memoria RAM DDR5 6000MHz (2x16GB) con iluminacion RGB.', 'accessories', 149.99, 90.00, 20, 5, 'https://picsum.photos/seed/corsairddr5/400/300', 'Corsair', true, ARRAY['ram','ddr5','gaming']),
  ('a0000001-0000-0000-0000-000000000011', 'tenant_techstore_alpha', 'Dell XPS 15 9530', 'DELL-XPS15-9530', 'Laptop premium con Intel Core i9 y pantalla OLED.', 'laptops', 2399.99, 1800.00, 8, 2, 'https://picsum.photos/seed/dellxps15/400/300', 'Dell', true, ARRAY['laptop','premium','windows']),
  ('a0000001-0000-0000-0000-000000000012', 'tenant_techstore_alpha', 'Keychron Q1 Pro', 'KB-KEYC-Q1PRO', 'Teclado mecanico custom inalambrico 75% aluminio.', 'accessories', 199.99, 120.00, 15, 5, 'https://picsum.photos/seed/keychronq1/400/300', 'Keychron', true, ARRAY['teclado','mecanico','inalambrico']),
  ('a0000001-0000-0000-0000-000000000013', 'tenant_techstore_alpha', 'Samsung Odyssey Neo G9', 'SAM-OD-NEOG9', 'Monitor gaming curvo de 49" Mini LED 240Hz.', 'monitors', 1799.99, 1300.00, 3, 1, 'https://picsum.photos/seed/samsungneog9/400/300', 'Samsung', true, ARRAY['monitor','gaming','ultrawide']),
  ('a0000001-0000-0000-0000-000000000014', 'tenant_techstore_alpha', 'Apple Watch Ultra 2', 'AW-ULTRA2', 'Reloj inteligente de titanio con GPS y conectividad celular.', 'accessories', 799.99, 550.00, 14, 4, 'https://picsum.photos/seed/awultra2/400/300', 'Apple', true, ARRAY['smartwatch','apple','fitness']),
  ('a0000001-0000-0000-0000-000000000015', 'tenant_techstore_alpha', 'Sony a7 IV', 'CAM-SONY-A7IV', 'Camara Mirrorless Full-Frame 33MP.', 'accessories', 2499.99, 1900.00, 6, 2, 'https://picsum.photos/seed/sonya7iv/400/300', 'Sony', true, ARRAY['camara','fotografia','mirrorless']),
  ('a0000001-0000-0000-0000-000000000016', 'tenant_techstore_alpha', 'Google Pixel 8 Pro', 'GOOG-PIX8P', 'Smartphone con IA integrada y camara avanzada 50MP.', 'smartphones', 999.99, 650.00, 18, 5, 'https://picsum.photos/seed/pixel8pro/400/300', 'Google', true, ARRAY['smartphone','android','ai']),
  ('a0000001-0000-0000-0000-000000000017', 'tenant_techstore_alpha', 'WD Black SN850X 1TB', 'SSD-WD-SN850X', 'SSD NVMe para PC y PS5 de alta velocidad.', 'storage', 89.99, 50.00, 40, 10, 'https://picsum.photos/seed/wdsn850x/400/300', 'Western Digital', true, ARRAY['ssd','almacenamiento','gaming']),
  ('a0000001-0000-0000-0000-000000000018', 'tenant_techstore_alpha', 'Anker 737 Power Bank', 'PB-ANK-737', 'Bateria externa de 24,000mAh con carga rapida 140W.', 'accessories', 149.99, 80.00, 25, 8, 'https://picsum.photos/seed/anker737/400/300', 'Anker', true, ARRAY['bateria','portatil','carga-rapida'])
on conflict (tenant_id, sku) do nothing;

-- ─── PRODUCTOS — TechStore Beta ────────────────────────────

insert into public.products (id, tenant_id, name, sku, description, category, price, cost, stock, min_stock, image_url, brand, is_active, tags)
values
  ('b0000001-0000-0000-0000-000000000001', 'tenant_techstore_beta', 'ThinkPad X1 Carbon Gen 11', 'LEN-X1C-G11-001', 'Ultrabook empresarial, Intel i7-1365U, 32GB RAM, pantalla 14" 2.8K OLED.', 'laptops', 2199.99, 1700.00, 15, 4, 'https://picsum.photos/seed/thinkpadx1/400/300', 'Lenovo', true, ARRAY['empresarial','ultrabook','oled']),
  ('b0000001-0000-0000-0000-000000000002', 'tenant_techstore_beta', 'Bose QuietComfort Ultra', 'BOSE-QCU-BLK', 'Auriculares premium con Immersive Audio, cancelacion de ruido adaptativa.', 'audio', 429.99, 280.00, 22, 6, 'https://picsum.photos/seed/boseqc/400/300', 'Bose', true, ARRAY['premium','spatial-audio','noise-cancelling']),
  ('b0000001-0000-0000-0000-000000000003', 'tenant_techstore_beta', 'iPhone 15 Pro Max 256GB', 'APL-IP15PM-256-TIT', 'Smartphone con chip A17 Pro, camara 48MP con zoom optico 5x, titanio natural.', 'smartphones', 1199.99, 920.00, 40, 10, 'https://picsum.photos/seed/iphone15pro/400/300', 'Apple', true, ARRAY['flagship','ios','titanio']),
  ('b0000001-0000-0000-0000-000000000004', 'tenant_techstore_beta', 'Microsoft Surface Pro 9', 'MS-SURFPRO9-i7', 'Tablet 2-en-1, Intel i7, 16GB RAM, pantalla 13" PixelSense.', 'tablets', 1599.99, 1200.00, 9, 3, 'https://picsum.photos/seed/surfacepro/400/300', 'Microsoft', true, ARRAY['2-en-1','empresarial','windows']),
  ('b0000001-0000-0000-0000-000000000005', 'tenant_techstore_beta', 'Dell UltraSharp U2723QE', 'DELL-U2723QE', 'Monitor 4K 27" IPS Black, USB-C 90W, KVM integrado.', 'monitors', 619.99, 430.00, 14, 4, 'https://picsum.photos/seed/dellmonitor/400/300', 'Dell', true, ARRAY['profesional','4k','usb-c']),
  ('b0000001-0000-0000-0000-000000000006', 'tenant_techstore_beta', 'Razer DeathAdder V3 Pro', 'RZR-DAV3PRO-BLK', 'Mouse gaming inalambrico, sensor Focus Pro 30K, 63g ultraligero.', 'accessories', 149.99, 85.00, 55, 12, 'https://picsum.photos/seed/razermouse/400/300', 'Razer', true, ARRAY['gaming','esports','wireless']),
  ('b0000001-0000-0000-0000-000000000007', 'tenant_techstore_beta', 'Asus ROG Zephyrus G14', 'ASUS-ROG-G14', 'Laptop gaming ultraligera con AMD Ryzen 9 y RTX 4070.', 'laptops', 1699.99, 1300.00, 10, 3, 'https://picsum.photos/seed/zephyrusg14/400/300', 'Asus', true, ARRAY['laptop','gaming','ligero']),
  ('b0000001-0000-0000-0000-000000000008', 'tenant_techstore_beta', 'Apple AirPods Pro 2', 'APP-AIRPRO2', 'Audifonos in-ear con cancelacion de ruido y audio espacial.', 'audio', 249.99, 150.00, 50, 15, 'https://picsum.photos/seed/airpodspro2/400/300', 'Apple', true, ARRAY['audifonos','apple','noise-cancelling']),
  ('b0000001-0000-0000-0000-000000000009', 'tenant_techstore_beta', 'Samsung Galaxy Tab S9 Ultra', 'SAM-TAB-S9U', 'Tablet premium de 14.6" AMOLED, S-Pen incluido.', 'tablets', 1199.99, 850.00, 7, 2, 'https://picsum.photos/seed/tabs9ultra/400/300', 'Samsung', true, ARRAY['tablet','android','premium']),
  ('b0000001-0000-0000-0000-000000000010', 'tenant_techstore_beta', 'Logitech MX Keys S', 'KB-LOG-MXKEYS', 'Teclado inalambrico avanzado para productividad.', 'accessories', 109.99, 65.00, 30, 8, 'https://picsum.photos/seed/mxkeys/400/300', 'Logitech', true, ARRAY['teclado','productividad','inalambrico']),
  ('b0000001-0000-0000-0000-000000000011', 'tenant_techstore_beta', 'Seagate FireCuda 530 2TB', 'SSD-SEA-FIRE530', 'Unidad de estado solido M.2 PCIe Gen4.', 'storage', 169.99, 100.00, 12, 4, 'https://picsum.photos/seed/firecuda/400/300', 'Seagate', true, ARRAY['ssd','almacenamiento','pcie4']),
  ('b0000001-0000-0000-0000-000000000012', 'tenant_techstore_beta', 'LG C3 42" OLED', 'TV-LG-C3-42', 'Smart TV OLED Evo 4K ideal como monitor gaming.', 'monitors', 999.99, 750.00, 5, 2, 'https://picsum.photos/seed/lgc3oled/400/300', 'LG', true, ARRAY['tv','oled','4k']),
  ('b0000001-0000-0000-0000-000000000013', 'tenant_techstore_beta', 'Netgear Nighthawk AX12', 'ROUT-NET-AX12', 'Router WiFi 6 de alto rendimiento para gaming y streaming.', 'networking', 399.99, 250.00, 8, 3, 'https://picsum.photos/seed/nighthawk/400/300', 'Netgear', true, ARRAY['router','wifi6','networking']),
  ('b0000001-0000-0000-0000-000000000014', 'tenant_techstore_beta', 'HyperX Cloud III Wireless', 'AUD-HYP-CLD3', 'Auriculares gaming inalambricos con bateria de 120 horas.', 'audio', 169.99, 95.00, 22, 6, 'https://picsum.photos/seed/hyperxcloud3/400/300', 'HyperX', true, ARRAY['headset','gaming','inalambrico']),
  ('b0000001-0000-0000-0000-000000000015', 'tenant_techstore_beta', 'OnePlus 12', 'ONE-PLUS12', 'Smartphone flagship killer con Snapdragon 8 Gen 3.', 'smartphones', 799.99, 580.00, 15, 4, 'https://picsum.photos/seed/oneplus12/400/300', 'OnePlus', true, ARRAY['smartphone','android','flagship']),
  ('b0000001-0000-0000-0000-000000000016', 'tenant_techstore_beta', 'Elgato Stream Deck MK.2', 'ACC-ELG-SD2', 'Controlador para creadores de contenido con 15 teclas LCD.', 'accessories', 149.99, 85.00, 18, 5, 'https://picsum.photos/seed/streamdeck/400/300', 'Elgato', true, ARRAY['streaming','creador','controlador'])
on conflict (tenant_id, sku) do nothing;

-- ─── CLIENTES — TechStore Alpha ────────────────────────────

insert into public.clients (tenant_id, name, email, phone, type, status, total_purchases, last_purchase)
values
  ('tenant_techstore_alpha', 'TechCorp Mexico',      'contact@techcorp.mx',        '+52 55 1234 5678', 'Corporativo',  'active',   15200.50, '2026-04-28'),
  ('tenant_techstore_alpha', 'Ana Garcia Lopez',     'ana.garcia@gmail.com',       '+52 33 9876 5432', 'Individual',   'active',    3499.99, '2026-04-30'),
  ('tenant_techstore_alpha', 'Distribuidora Norte',  'ventas@distnorte.com',        '+52 81 5555 0001', 'Distribuidor', 'active',   42500.00, '2026-05-01'),
  ('tenant_techstore_alpha', 'Roberto Hernandez',    'r.hernandez@outlook.com',     '+52 55 7777 8888', 'Individual',   'inactive',   899.99, '2026-03-15'),
  ('tenant_techstore_alpha', 'GameStation SA',       'info@gamestation.mx',         '+52 33 2222 3333', 'Corporativo',  'active',   28750.00, '2026-05-02'),
  ('tenant_techstore_alpha', 'Universidad Tech',     'compras@unitech.edu.mx',      '+52 22 4444 5555', 'Educacion',    'active',   65000.00, '2026-04-25')
on conflict do nothing;

-- ─── VENTAS — TechStore Alpha ──────────────────────────────
-- Nota: seller_id queda en null porque los UUIDs del mock no existen en auth.users.
-- Las ventas se muestran correctamente usando seller_name.

insert into public.sales (id, tenant_id, seller_name, total_amount, payment_method, status, notes, sale_date)
values
  ('c0000001-0000-0000-0000-000000000001', 'tenant_techstore_alpha', 'Maria Vendedora',      3699.97, 'credit_card', 'completed', 'Cliente corporativo',    '2026-04-28T10:30:00Z'),
  ('c0000001-0000-0000-0000-000000000002', 'tenant_techstore_alpha', 'Maria Vendedora',      1299.99, 'debit_card',  'completed', '',                       '2026-04-29T14:15:00Z'),
  ('c0000001-0000-0000-0000-000000000003', 'tenant_techstore_alpha', 'Carlos Administrador', 1409.95, 'transfer',    'completed', 'Venta mayorista',        '2026-04-30T09:00:00Z'),
  ('c0000001-0000-0000-0000-000000000004', 'tenant_techstore_alpha', 'Maria Vendedora',      1099.99, 'cash',        'pending',   'Pendiente de retiro',    '2026-05-01T16:45:00Z'),
  ('c0000001-0000-0000-0000-000000000005', 'tenant_techstore_alpha', 'Carlos Administrador', 2249.97, 'credit_card', 'completed', 'Setup gaming completo',  '2026-05-02T11:20:00Z')
on conflict (id) do nothing;

-- ─── ITEMS DE VENTAS ───────────────────────────────────────

insert into public.sale_items (sale_id, product_id, product_name, quantity, unit_price, subtotal)
values
  -- sale 001
  ('c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'MacBook Pro 16" M3 Max',   1, 3499.99, 3499.99),
  ('c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000006', 'Logitech MX Master 3S',    2,   99.99,  199.98),
  -- sale 002
  ('c0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000003', 'Samsung Galaxy S24 Ultra', 1, 1299.99, 1299.99),
  -- sale 003
  ('c0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000002', 'Sony WH-1000XM5',          3,  349.99, 1049.97),
  ('c0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000007', 'Samsung 990 Pro 2TB NVMe', 2,  179.99,  359.98),
  -- sale 004
  ('c0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000004', 'iPad Pro 12.9" M2',        1, 1099.99, 1099.99),
  -- sale 005
  ('c0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000005', 'LG UltraGear 27GP950',     2,  799.99, 1599.98),
  ('c0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000008', 'ASUS ROG Rapture GT-AXE16000', 1, 649.99, 649.99)
on conflict do nothing;
