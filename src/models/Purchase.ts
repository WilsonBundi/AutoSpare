import pool from '../config/database';

export interface Purchase {
  id?: number;
  supplier_id?: number;
  purchase_date: Date;
  invoice_number?: string;
  total_amount: number;
  paid_amount?: number;
  payment_method?: string;
  notes?: string;
  user_id: number;
}

export interface PurchaseItem {
  id?: number;
  purchase_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export class PurchaseModel {
  static async create(purchase: Purchase, items: PurchaseItem[]): Promise<any> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Create purchase
      const purchaseResult = await client.query(
        `INSERT INTO purchases (supplier_id, purchase_date, invoice_number, total_amount, paid_amount, payment_method, notes, user_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          purchase.supplier_id,
          purchase.purchase_date,
          purchase.invoice_number,
          purchase.total_amount,
          purchase.paid_amount || 0,
          purchase.payment_method,
          purchase.notes,
          purchase.user_id
        ]
      );

      const createdPurchase = purchaseResult.rows[0];

      // Create purchase items and update stock
      for (const item of items) {
        await client.query(
          `INSERT INTO purchase_items (purchase_id, product_id, quantity, unit_price, total_price)
           VALUES ($1, $2, $3, $4, $5)`,
          [createdPurchase.id, item.product_id, item.quantity, item.unit_price, item.total_price]
        );

        // Update product stock
        await client.query(
          'UPDATE products SET current_stock = current_stock + $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );

        // Record stock movement
        await client.query(
          `INSERT INTO stock_movements (product_id, movement_type, quantity, reference_type, reference_id, user_id, notes)
           VALUES ($1, 'purchase', $2, 'purchase', $3, $4, $5)`,
          [item.product_id, item.quantity, createdPurchase.id, purchase.user_id, `Purchase from supplier`]
        );
      }

      await client.query('COMMIT');
      return createdPurchase;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getAll(filters?: any): Promise<any[]> {
    let query = `
      SELECT p.*, s.name as supplier_name, u.full_name as user_name
      FROM purchases p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.start_date) {
      query += ` AND p.purchase_date >= $${paramCount}`;
      params.push(filters.start_date);
      paramCount++;
    }

    if (filters?.end_date) {
      query += ` AND p.purchase_date <= $${paramCount}`;
      params.push(filters.end_date);
      paramCount++;
    }

    if (filters?.supplier_id) {
      query += ` AND p.supplier_id = $${paramCount}`;
      params.push(filters.supplier_id);
      paramCount++;
    }

    query += ' ORDER BY p.purchase_date DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id: number): Promise<any> {
    const result = await pool.query(
      `SELECT p.*, s.name as supplier_name, u.full_name as user_name
       FROM purchases p
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async getPurchaseItems(purchaseId: number): Promise<any[]> {
    const result = await pool.query(
      `SELECT pi.*, p.name as product_name, p.code
       FROM purchase_items pi
       LEFT JOIN products p ON pi.product_id = p.id
       WHERE pi.purchase_id = $1`,
      [purchaseId]
    );
    return result.rows;
  }

  static async update(id: number, purchase: Partial<Purchase>): Promise<any> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.keys(purchase).forEach(key => {
      if (purchase[key as keyof Purchase] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(purchase[key as keyof Purchase]);
        paramCount++;
      }
    });

    values.push(id);
    const query = `UPDATE purchases SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM purchases WHERE id = $1', [id]);
  }
}
