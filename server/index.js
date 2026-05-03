/**
 * ═══════════════════════════════════════
 *  Server Entry Point (Simulado)
 * ═══════════════════════════════════════
 * 
 * Para ejecutar: node server/index.js
 * (requiere npm install express cors)
 */

// const express = require('express');
// const cors = require('cors');
// const { tenantMiddleware } = require('./middleware/tenantMiddleware');
// const productRoutes = require('./routes/productRoutes');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Aplicar middleware de tenant a todas las rutas /api
// app.use('/api', tenantMiddleware);

// // Registrar rutas
// productRoutes(app);

// // Health check (sin tenant requerido)
// app.get('/health', (req, res) => {
//   res.json({ status: 'ok', timestamp: new Date().toISOString() });
// });

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

console.log('✅ Server structure defined — install express & cors to run');
console.log('   npm install express cors');
console.log('   node server/index.js');

module.exports = {};
