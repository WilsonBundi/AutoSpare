import pool from '../config/database';

export interface Product {
  id?: number;
  name: string;
  code?: string;
  barcode?: string;
  category_id?: number;
  buying_price: number;
  selling_price: number;
  wholesale_price?: number;
  unit?: string;
  current_stock?: number;
  reorder_level?: number;
  location?: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
}

export class ProductModel {
  static async create(product: Product): Promise<any> {
    const result = await pool.query(
      `INSERT INTO products (name, code, barcode, category_id, buying_price, selling_price, wholesale_price, unit, current_stock, reorder_level, location, description, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        product.name,
        product.code,
        product.barcode,
        product.category_id,
        product.buying_price,
        product.selling_price,
        product.wholesale_price,
        product.unit || 'piece',
        product.current_stock || 0,
        product.reorder_level || 10,
        product.location,
        product.description,
        product.image_url
      ]
    );
    return result.rows[0];
  }

  static async getAll(filters?: any): Promise<any[]> {
    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = true';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.category_id) {
      query += ` AND p.category_id = $${paramCount}`;
      params.push(filters.category_id);
      paramCount++;
    }

    if (filters?.search) {
      query += ` AND (p.name ILIKE $${paramCount} OR p.code ILIKE $${paramCount} OR p.barcode ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ' ORDER BY p.name';

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id: number): Promise<any> {
    const result = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByCode(code: string): Promise<any> {
    const result = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.code = $1',
      [code]
    );
    return result.rows[0];
  }

  static async findByBarcode(barcode: string): Promise<any> {
    const result = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.barcode = $1',
      [barcode]
    );
    return result.rows[0];
  }

  static async update(id: number, product: Partial<Product>): Promise<any> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.keys(product).forEach(key => {
      if (product[key as keyof Product] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(product[key as keyof Product]);
        paramCount++;
      }
    });

    values.push(id);
    const query = `UPDATE products SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id: number): Promise<void> {
    await pool.query('UPDATE products SET is_active = false WHERE id = $1', [id]);
  }

  static async updateStock(id: number, quantity: number): Promise<void> {
    await pool.query('UPDATE products SET current_stock = current_stock + $1 WHERE id = $2', [quantity, id]);
  }

  static async getLowStock(threshold?: number): Promise<any[]> {
    const result = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.current_stock <= COALESCE($1, p.reorder_level) AND p.is_active = true',
      [threshold]
    );
    return result.rows;
  }
}
