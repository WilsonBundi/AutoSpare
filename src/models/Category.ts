import pool from '../config/database';

export interface Category {
  id?: number;
  name: string;
  description?: string;
  is_active?: boolean;
}

export class CategoryModel {
  static async create(category: Category): Promise<any> {
    const result = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [category.name, category.description]
    );
    return result.rows[0];
  }

  static async getAll(): Promise<any[]> {
    const result = await pool.query('SELECT * FROM categories WHERE is_active = true ORDER BY name');
    return result.rows;
  }

  static async findById(id: number): Promise<any> {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id: number, category: Partial<Category>): Promise<any> {
    const result = await pool.query(
      'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [category.name, category.description, id]
    );
    return result.rows[0];
  }

  static async delete(id: number): Promise<void> {
    await pool.query('UPDATE categories SET is_active = false WHERE id = $1', [id]);
  }
}
