/**
 * ═══════════════════════════════════════════════════
 *  Sale Schema — Mongoose (Simulado)
 * ═══════════════════════════════════════════════════
 * 
 * Registro de ventas multi-tenant.
 * Cada venta incluye los productos vendidos (items),
 * el usuario que registró la venta (sellerId),
 * y el clientId para aislamiento de datos.
 */

const saleSchema = {
  name: 'Sale',
  fields: {
    clientId: {
      type: 'ObjectId',
      ref: 'Client',
      required: true,
      index: true,
      description: 'Tenant al que pertenece esta venta'
    },
    sellerId: {
      type: 'ObjectId',
      ref: 'User',
      required: true,
      description: 'Usuario que registró la venta'
    },
    items: {
      type: 'Array',
      description: 'Productos vendidos en esta transacción',
      schema: {
        productId: {
          type: 'ObjectId',
          ref: 'Product',
          required: true,
        },
        productName: {
          type: 'String',
          required: true,
          description: 'Snapshot del nombre al momento de la venta'
        },
        quantity: {
          type: 'Number',
          required: true,
          min: 1,
        },
        unitPrice: {
          type: 'Number',
          required: true,
          min: 0,
          description: 'Precio unitario al momento de la venta (snapshot)'
        },
        subtotal: {
          type: 'Number',
          required: true,
          min: 0,
        },
      },
    },
    totalAmount: {
      type: 'Number',
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: 'String',
      enum: ['cash', 'credit_card', 'debit_card', 'transfer', 'other'],
      default: 'cash',
    },
    status: {
      type: 'String',
      enum: ['completed', 'pending', 'cancelled', 'refunded'],
      default: 'completed',
    },
    notes: {
      type: 'String',
      default: '',
    },
    saleDate: {
      type: 'Date',
      default: 'Date.now',
    },
    createdAt: {
      type: 'Date',
      default: 'Date.now',
    },
  },
  options: {
    timestamps: true,
  },
};

// ─── Mongoose Implementation (comentado hasta conexión real) ───
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
//
// const SaleItemSchema = new Schema({
//   productId:   { type: Schema.Types.ObjectId, ref: 'Product', required: true },
//   productName: { type: String, required: true },
//   quantity:    { type: Number, required: true, min: 1 },
//   unitPrice:   { type: Number, required: true, min: 0 },
//   subtotal:    { type: Number, required: true, min: 0 },
// }, { _id: false });
//
// const SaleSchema = new Schema({
//   clientId:      { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
//   sellerId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   items:         [SaleItemSchema],
//   totalAmount:   { type: Number, required: true, min: 0 },
//   paymentMethod: { type: String, enum: ['cash','credit_card','debit_card','transfer','other'], default: 'cash' },
//   status:        { type: String, enum: ['completed','pending','cancelled','refunded'], default: 'completed' },
//   notes:         { type: String, default: '' },
//   saleDate:      { type: Date, default: Date.now },
// }, { timestamps: true });
//
// SaleSchema.index({ clientId: 1, saleDate: -1 });
// module.exports = mongoose.model('Sale', SaleSchema);

module.exports = saleSchema;
