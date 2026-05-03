/**
 * ═══════════════════════════════════════════════════
 *  User Schema — Mongoose (Simulado)
 * ═══════════════════════════════════════════════════
 * 
 * Cada usuario pertenece a un tenant (clientId).
 * El campo 'role' permite escalar a permisos granulares.
 * 
 * En producción se conectaría con:
 *   const mongoose = require('mongoose');
 *   module.exports = mongoose.model('User', userSchema);
 */

const userSchema = {
  name: 'User',
  fields: {
    clientId: {
      type: 'ObjectId',
      ref: 'Client',
      required: true,
      index: true,
      description: 'Tenant al que pertenece este usuario — clave para multi-tenancy'
    },
    name: {
      type: 'String',
      required: true,
      trim: true,
    },
    email: {
      type: 'String',
      required: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: 'String',
      required: true,
    },
    role: {
      type: 'String',
      enum: ['admin', 'manager', 'seller'],
      default: 'seller',
    },
    isActive: {
      type: 'Boolean',
      default: true,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
};

// ─── Mongoose Implementation (comentado hasta conexión real) ───
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
//
// const UserSchema = new Schema({
//   clientId:     { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
//   name:         { type: String, required: true, trim: true },
//   email:        { type: String, required: true, unique: true, lowercase: true },
//   passwordHash: { type: String, required: true },
//   role:         { type: String, enum: ['admin', 'manager', 'seller'], default: 'seller' },
//   isActive:     { type: Boolean, default: true },
// }, { timestamps: true });
//
// UserSchema.index({ clientId: 1, email: 1 });
// module.exports = mongoose.model('User', UserSchema);

module.exports = userSchema;
