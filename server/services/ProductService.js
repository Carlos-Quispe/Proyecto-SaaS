const { productRepository } = require('../repositories/ProductRepository');

class ProductService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAllProducts(clientId) {
    return this.repository.findAll(clientId);
  }

  async getProductById(clientId, productId) {
    const product = await this.repository.findById(clientId, productId);
    if (!product) throw new Error(`Producto ${productId} no encontrado`);
    return product;
  }

  async getProductsByCategory(clientId, category) {
    return this.repository.findByCategory(clientId, category);
  }

  async getLowStockProducts(clientId) {
    return this.repository.findLowStock(clientId);
  }

  async createProduct(clientId, productData) {
    if (!productData.name || !productData.price) {
      throw new Error('Nombre y precio son obligatorios');
    }
    return this.repository.create(clientId, productData);
  }

  async updateProduct(clientId, productId, updates) {
    const product = await this.repository.update(clientId, productId, updates);
    if (!product) throw new Error(`No se pudo actualizar ${productId}`);
    return product;
  }

  async deleteProduct(clientId, productId) {
    const deleted = await this.repository.delete(clientId, productId);
    if (!deleted) throw new Error(`No se pudo eliminar ${productId}`);
    return { success: true };
  }

  async searchProducts(clientId, searchTerm) {
    return this.repository.search(clientId, searchTerm);
  }

  async getDashboardStats(clientId) {
    return this.repository.getStats(clientId);
  }
}

const productService = new ProductService(productRepository);
module.exports = { ProductService, productService };
