import pool from '../config/database';

export interface Supplier {
  id?: number;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  is_active?: boolean;
}

export class SupplierModel {
  static async create(supplier: Supplier): Promise<any> {
    const result = await pool.query(
      'INSERT INTO suppliers (name, contact_person, phone, email, address, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [supplier.name, supplier.contact_person, supplier.phone, supplier.email, supplier.address, supplier.notes]
    );
    return result.rows[0];
  }

  static async getAll(): Promise<any[]> {
    const result = await pool.query('SELECT * FROM suppliers WHERE is_active = true ORDER BY name');
    return result.rows;
  }

  static async findById(id: number): Promise<any> {
    const result = await pool.query('SELECT * FROM suppliers WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id: number, supplier: Partial<Supplier>): Promise<any> {
    const result = await pool.query(
      'UPDATE suppliers SET name = $1, contact_person = $2, phone = $3, email = $4, address = $5, notes = $6 WHERE id = $7 RETURNING *',
      [supplier.name, supplier.contact_person, supplier.phone, supplier.email, supplier.address, supplier.notes, id]
    );
    return result.rows[0];
  }

  static async delete(id: number): Promise<void> {
    await pool.query('UPDATE suppliers SET is_active = false WHERE id = $1', [id]);
  }
}
