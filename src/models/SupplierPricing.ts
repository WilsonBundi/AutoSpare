import pool from '../config/database';

export interface SupplierPricing {
  id?: number;
  supplier_id: number;
  product_id: number;
  buying_price: number;
  last_updated?: string;
}

export class SupplierPricingModel {
  static async create(pricing: SupplierPricing): Promise<any> {
    const result = await pool.query(
      `INSERT INTO supplier_pricing (supplier_id, product_id, buying_price)
       VALUES ($1, $2, $3)
       ON CONFLICT (supplier_id, product_id)
       DO UPDATE SET buying_price = $3, last_updated = CURRENT_TIMESTAMP
       RETURNING *`,
      [pricing.supplier_id, pricing.product_id, pricing.buying_price]
    );
    return result.rows[0];
  }

  static async getBySupplier(supplierId: number): Promise<any[]> {
    const result = await pool.query(
      `SELECT sp.*, p.name as product_name, p.code as product_code
       FROM supplier_pricing sp
       JOIN products p ON sp.product_id = p.id
       WHERE sp.supplier_id = $1
       ORDER BY p.name`,
      [supplierId]
    );
    return result.rows;
  }

  static async getByProduct(productId: number): Promise<any[]> {
    const result = await pool.query(
      `SELECT sp.*, s.name as supplier_name
       FROM supplier_pricing sp
       JOIN suppliers s ON sp.supplier_id = s.id
       WHERE sp.product_id = $1
       ORDER BY sp.buying_price ASC`,
      [productId]
    );
    return result.rows;
  }

  static async getPrice(supplierId: number, productId: number): Promise<any> {
    const result = await pool.query(
      'SELECT * FROM supplier_pricing WHERE supplier_id = $1 AND product_id = $2',
      [supplierId, productId]
    );
    return result.rows[0];
  }

  static async delete(supplierId: number, productId: number): Promise<void> {
    await pool.query(
      'DELETE FROM supplier_pricing WHERE supplier_id = $1 AND product_id = $2',
      [supplierId, productId]
    );
  }
}
