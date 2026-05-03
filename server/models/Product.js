/**
 * ═══════════════════════════════════════════════════
 *  Product Schema — Mongoose (Simulado)
 * ═══════════════════════════════════════════════════
 * 
 * Producto con clientId para aislamiento multi-tenant.
 * Incluye campos para gestión de inventario completa.
 */

const productSchema = {
  name: 'Product',
  fields: {
    clientId: {
      type: 'ObjectId',
      ref: 'Client',
      required: true,
      index: true,
      description: 'Tenant owner — garantiza aislamiento de datos'
    },
    name: {
      type: 'String',
      required: true,
      trim: true,
    },
    sku: {
      type: 'String',
      required: true,
      unique: true,
      description: 'Stock Keeping Unit — código único de producto'
    },
    description: {
      type: 'String',
      default: '',
    },
    category: {
      type: 'String',
      required: true,
      enum: ['laptops', 'smartphones', 'tablets', 'audio', 'accessories', 'networking', 'storage', 'monitors'],
    },
    price: {
      type: 'Number',
      required: true,
      min: 0,
    },
    cost: {
      type: 'Number',
      required: true,
      min: 0,
      description: 'Costo de adquisición para calcular margen'
    },
    stock: {
      type: 'Number',
      required: true,
      default: 0,
      min: 0,
    },
    minStock: {
      type: 'Number',
      default: 5,
      description: 'Nivel mínimo de stock para alertas'
    },
    imageUrl: {
      type: 'String',
      default: '',
    },
    brand: {
      type: 'String',
      required: true,
    },
    isActive: {
      type: 'Boolean',
      default: true,
    },
    tags: {
      type: ['String'],
      default: [],
    },
    createdAt: {
      type: 'Date',
      default: 'Date.now',
    },
    updatedAt: {
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
// const ProductSchema = new Schema({
//   clientId:    { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
//   name:        { type: String, required: true, trim: true },
//   sku:         { type: String, required: true },
//   description: { type: String, default: '' },
//   category:    { type: String, required: true, enum: ['laptops','smartphones','tablets','audio','accessories','networking','storage','monitors'] },
//   price:       { type: Number, required: true, min: 0 },
//   cost:        { type: Number, required: true, min: 0 },
//   stock:       { type: Number, required: true, default: 0, min: 0 },
//   minStock:    { type: Number, default: 5 },
//   imageUrl:    { type: String, default: '' },
//   brand:       { type: String, required: true },
//   isActive:    { type: Boolean, default: true },
//   tags:        [{ type: String }],
// }, { timestamps: true });
//
// ProductSchema.index({ clientId: 1, sku: 1 }, { unique: true });
// ProductSchema.index({ clientId: 1, category: 1 });
// module.exports = mongoose.model('Product', ProductSchema);

module.exports = productSchema;
