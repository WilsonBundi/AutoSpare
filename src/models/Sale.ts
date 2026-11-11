import pool from '../config/database';

export interface Sale {
  id?: number;
  sale_number: string;
  sale_date?: Date;
  customer_id?: number;
  subtotal: number;
  discount_amount?: number;
  tax_amount?: number;
  total_amount: number;
  paid_amount: number;
  change_amount?: number;
  payment_method?: string;
  payment_status?: string;
  notes?: string;
  user_id: number;
}

export interface SaleItem {
  id?: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  discount_amount?: number;
  total_price: number;
}

export class SaleModel {
  static async create(sale: Sale, items: SaleItem[]): Promise<any> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Create sale
      const saleResult = await client.query(
        `INSERT INTO sales (sale_number, customer_id, subtotal, discount_amount, tax_amount, total_amount, paid_amount, change_amount, payment_method, payment_status, notes, user_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [
          sale.sale_number,
          sale.customer_id,
          sale.subtotal,
          sale.discount_amount || 0,
          sale.tax_amount || 0,
          sale.total_amount,
          sale.paid_amount,
          sale.change_amount || 0,
          sale.payment_method,
          sale.payment_status || 'paid',
          sale.notes,
          sale.user_id
        ]
      );

      const createdSale = saleResult.rows[0];

      // Create sale items and update stock
      for (const item of items) {
        await client.query(
          `INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, discount_amount, total_price)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [createdSale.id, item.product_id, item.quantity, item.unit_price, item.discount_amount || 0, item.total_price]
        );

        // Update product stock
        await client.query(
          'UPDATE products SET current_stock = current_stock - $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );

        // Record stock movement
        await client.query(
          `INSERT INTO stock_movements (product_id, movement_type, quantity, reference_type, reference_id, user_id)
           VALUES ($1, 'sale', $2, 'sale', $3, $4)`,
          [item.product_id, item.quantity, createdSale.id, sale.user_id]
        );
      }

      await client.query('COMMIT');
      return createdSale;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getAll(filters?: any): Promise<any[]> {
    let query = `
      SELECT s.*, c.name as customer_name, u.full_name as cashier_name
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.is_voided = false
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.start_date) {
      query += ` AND s.sale_date >= $${paramCount}`;
      params.push(filters.start_date);
      paramCount++;
    }

    if (filters?.end_date) {
      query += ` AND s.sale_date <= $${paramCount}`;
      params.push(filters.end_date);
      paramCount++;
    }

    if (filters?.customer_id) {
      query += ` AND s.customer_id = $${paramCount}`;
      params.push(filters.customer_id);
      paramCount++;
    }

    query += ' ORDER BY s.sale_date DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id: number): Promise<any> {
    const result = await pool.query(
      `SELECT s.*, c.name as customer_name, u.full_name as cashier_name
       FROM sales s
       LEFT JOIN customers c ON s.customer_id = c.id
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async getSaleItems(saleId: number): Promise<any[]> {
    const result = await pool.query(
      `SELECT si.*, p.name as product_name, p.code
       FROM sale_items si
       LEFT JOIN products p ON si.product_id = p.id
       WHERE si.sale_id = $1`,
      [saleId]
    );
    return result.rows;
  }

  static async voidSale(id: number, userId: number, reason: string): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Get sale items
      const items = await client.query('SELECT * FROM sale_items WHERE sale_id = $1', [id]);

      // Restore stock
      for (const item of items.rows) {
        await client.query(
          'UPDATE products SET current_stock = current_stock + $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );

        await client.query(
          `INSERT INTO stock_movements (product_id, movement_type, quantity, reference_type, reference_id, user_id, notes)
           VALUES ($1, 'return', $2, 'sale', $3, $4, $5)`,
          [item.product_id, item.quantity, id, userId, 'Sale voided']
        );
      }

      // Mark sale as voided
      await client.query(
        'UPDATE sales SET is_voided = true, voided_by = $1, voided_at = CURRENT_TIMESTAMP, void_reason = $2 WHERE id = $3',
        [userId, reason, id]
      );

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async generateSaleNumber(): Promise<string> {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const result = await pool.query(
      "SELECT COUNT(*) as count FROM sales WHERE sale_date::date = CURRENT_DATE"
    );
    const count = parseInt(result.rows[0].count) + 1;
    return `SALE${today}${String(count).padStart(4, '0')}`;
  }
}
