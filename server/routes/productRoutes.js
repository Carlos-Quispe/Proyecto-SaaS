const { productService } = require('../services/ProductService');

const productRoutes = (app) => {
  // GET /api/products — Todos los productos del tenant
  app.get('/api/products', async (req, res) => {
    try {
      const products = await productService.getAllProducts(req.clientId);
      res.json({ success: true, data: products, count: products.length });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/products/stats — Estadísticas del dashboard
  app.get('/api/products/stats', async (req, res) => {
    try {
      const stats = await productService.getDashboardStats(req.clientId);
      res.json({ success: true, data: stats });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/products/low-stock
  app.get('/api/products/low-stock', async (req, res) => {
    try {
      const products = await productService.getLowStockProducts(req.clientId);
      res.json({ success: true, data: products });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/products/search?q=term
  app.get('/api/products/search', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) return res.status(400).json({ success: false, error: 'Parámetro q requerido' });
      const products = await productService.searchProducts(req.clientId, q);
      res.json({ success: true, data: products });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/products/category/:category
  app.get('/api/products/category/:category', async (req, res) => {
    try {
      const products = await productService.getProductsByCategory(req.clientId, req.params.category);
      res.json({ success: true, data: products });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/products/:id
  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await productService.getProductById(req.clientId, req.params.id);
      res.json({ success: true, data: product });
    } catch (err) {
      res.status(404).json({ success: false, error: err.message });
    }
  });
};

module.exports = productRoutes;
