import { Request, Response } from 'express';
import pool from '../config/database';

export const addStock = async (req: any, res: Response) => {
  try {
    const { product_id, quantity, notes } = req.body;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Update product stock
      await client.query(
        'UPDATE products SET current_stock = current_stock + $1 WHERE id = $2',
        [quantity, product_id]
      );

      // Record stock movement
      await client.query(
        `INSERT INTO stock_movements (product_id, movement_type, quantity, reference_type, reference_id, user_id, notes)
         VALUES ($1, 'stock_in', $2, 'manual', NULL, $3, $4)`,
        [product_id, quantity, req.user.id, notes]
      );

      await client.query('COMMIT');
      res.json({ message: 'Stock added successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to add stock' });
  }
};

export const adjustStock = async (req: any, res: Response) => {
  try {
    const { product_id, quantity, reason } = req.body;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Update product stock
      await client.query(
        'UPDATE products SET current_stock = current_stock + $1 WHERE id = $2',
        [quantity, product_id]
      );

      // Record stock movement
      const movementType = quantity > 0 ? 'adjustment_positive' : 'adjustment_negative';
      await client.query(
        `INSERT INTO stock_movements (product_id, movement_type, quantity, reference_type, reference_id, user_id, notes)
         VALUES ($1, $2, $3, 'manual', NULL, $4, $5)`,
        [product_id, movementType, Math.abs(quantity), req.user.id, reason]
      );

      await client.query('COMMIT');
      res.json({ message: 'Stock adjusted successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to adjust stock' });
  }
};

export const getStockMovements = async (req: Request, res: Response) => {
  try {
    const { product_id, start_date, end_date } = req.query;
    let query = `
      SELECT sm.*, p.name as product_name, p.code, u.full_name as user_name
      FROM stock_movements sm
      LEFT JOIN products p ON sm.product_id = p.id
      LEFT JOIN users u ON sm.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (product_id) {
      query += ` AND sm.product_id = $${paramCount}`;
      params.push(product_id);
      paramCount++;
    }

    if (start_date) {
      query += ` AND sm.created_at >= $${paramCount}`;
      params.push(start_date);
      paramCount++;
    }

    if (end_date) {
      query += ` AND sm.created_at <= $${paramCount}`;
      params.push(end_date);
      paramCount++;
    }

    query += ' ORDER BY sm.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch stock movements' });
  }
};
