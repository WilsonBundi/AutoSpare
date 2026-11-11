import pool from '../config/database';

export interface Customer {
  id?: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  customer_type?: string;
  credit_limit?: number;
  current_balance?: number;
  is_active?: boolean;
}

export class CustomerModel {
  static async create(customer: Customer): Promise<any> {
    const result = await pool.query(
      'INSERT INTO customers (name, phone, email, address, customer_type, credit_limit, current_balance) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [
        customer.name,
        customer.phone,
        customer.email,
        customer.address,
        customer.customer_type || 'walk-in',
        customer.credit_limit || 0,
        customer.current_balance || 0
      ]
    );
    return result.rows[0];
  }

  static async getAll(filters?: any): Promise<any[]> {
    let query = 'SELECT * FROM customers WHERE is_active = true';
    const params: any[] = [];

    if (filters?.search) {
      query += ' AND (name ILIKE $1 OR phone ILIKE $1)';
      params.push(`%${filters.search}%`);
    }

    query += ' ORDER BY name';

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id: number): Promise<any> {
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id: number, customer: Partial<Customer>): Promise<any> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.keys(customer).forEach(key => {
      if (customer[key as keyof Customer] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(customer[key as keyof Customer]);
        paramCount++;
      }
    });

    values.push(id);
    const query = `UPDATE customers SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id: number): Promise<void> {
    await pool.query('UPDATE customers SET is_active = false WHERE id = $1', [id]);
  }

  static async updateBalance(id: number, amount: number): Promise<void> {
    await pool.query('UPDATE customers SET current_balance = current_balance + $1 WHERE id = $2', [amount, id]);
  }

  static async getDebtors(): Promise<any[]> {
    const result = await pool.query(
      'SELECT * FROM customers WHERE current_balance > 0 AND is_active = true ORDER BY current_balance DESC'
    );
    return result.rows;
  }
}
