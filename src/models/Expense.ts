import pool from '../config/database';

export interface Expense {
  id?: number;
  expense_date: Date;
  category: string;
  description?: string;
  amount: number;
  payment_method?: string;
  notes?: string;
  user_id: number;
}

export class ExpenseModel {
  static async create(expense: Expense): Promise<any> {
    const result = await pool.query(
      `INSERT INTO expenses (expense_date, category, description, amount, payment_method, notes, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        expense.expense_date,
        expense.category,
        expense.description,
        expense.amount,
        expense.payment_method,
        expense.notes,
        expense.user_id
      ]
    );
    return result.rows[0];
  }

  static async getAll(filters?: any): Promise<any[]> {
    let query = `
      SELECT e.*, u.full_name as user_name
      FROM expenses e
      LEFT JOIN users u ON e.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.start_date) {
      query += ` AND e.expense_date >= $${paramCount}`;
      params.push(filters.start_date);
      paramCount++;
    }

    if (filters?.end_date) {
      query += ` AND e.expense_date <= $${paramCount}`;
      params.push(filters.end_date);
      paramCount++;
    }

    if (filters?.category) {
      query += ` AND e.category = $${paramCount}`;
      params.push(filters.category);
      paramCount++;
    }

    query += ' ORDER BY e.expense_date DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getById(id: number): Promise<any> {
    const result = await pool.query(
      'SELECT e.*, u.full_name as user_name FROM expenses e LEFT JOIN users u ON e.user_id = u.id WHERE e.id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async update(id: number, expense: Partial<Expense>): Promise<any> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.keys(expense).forEach(key => {
      if (expense[key as keyof Expense] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(expense[key as keyof Expense]);
        paramCount++;
      }
    });

    values.push(id);
    const query = `UPDATE expenses SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
  }

  static async getTotalByDateRange(startDate: string, endDate: string): Promise<any> {
    const result = await pool.query(
      `SELECT
        category,
        SUM(amount) as total_amount,
        COUNT(*) as count
       FROM expenses
       WHERE expense_date >= $1 AND expense_date <= $2
       GROUP BY category
       ORDER BY total_amount DESC`,
      [startDate, endDate]
    );
    return result.rows;
  }
}
