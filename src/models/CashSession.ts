import pool from '../config/database';

export interface CashSession {
  id?: number;
  user_id: number;
  opening_balance?: number;
  closing_balance?: number;
  expected_closing?: number;
  variance?: number;
  session_start?: Date;
  session_end?: Date;
  notes?: string;
}

export class CashSessionModel {
  static async create(session: CashSession): Promise<any> {
    const result = await pool.query(
      `INSERT INTO cash_sessions (user_id, opening_balance, session_start, notes)
       VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *`,
      [session.user_id, session.opening_balance || 0, session.notes]
    );
    return result.rows[0];
  }

  static async getActiveSession(userId: number): Promise<any> {
    const result = await pool.query(
      'SELECT * FROM cash_sessions WHERE user_id = $1 AND session_end IS NULL ORDER BY session_start DESC LIMIT 1',
      [userId]
    );
    return result.rows[0];
  }

  static async closeSession(id: number, closingBalance: number, notes?: string): Promise<any> {
    const session = await pool.query('SELECT * FROM cash_sessions WHERE id = $1', [id]);
    const sessionData = session.rows[0];

    if (!sessionData) {
      throw new Error('Session not found');
    }

    const expectedClosing = sessionData.opening_balance;
    const variance = closingBalance - expectedClosing;

    const result = await pool.query(
      `UPDATE cash_sessions
       SET closing_balance = $1, expected_closing = $2, variance = $3, session_end = CURRENT_TIMESTAMP, notes = COALESCE($4, notes)
       WHERE id = $5 RETURNING *`,
      [closingBalance, expectedClosing, variance, notes, id]
    );
    return result.rows[0];
  }

  static async getAll(filters?: any): Promise<any[]> {
    let query = `
      SELECT cs.*, u.full_name as user_name
      FROM cash_sessions cs
      LEFT JOIN users u ON cs.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.user_id) {
      query += ` AND cs.user_id = $${paramCount}`;
      params.push(filters.user_id);
      paramCount++;
    }

    if (filters?.start_date) {
      query += ` AND cs.session_start >= $${paramCount}`;
      params.push(filters.start_date);
      paramCount++;
    }

    if (filters?.end_date) {
      query += ` AND cs.session_start <= $${paramCount}`;
      params.push(filters.end_date);
      paramCount++;
    }

    query += ' ORDER BY cs.session_start DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getById(id: number): Promise<any> {
    const result = await pool.query(
      `SELECT cs.*, u.full_name as user_name
       FROM cash_sessions cs
       LEFT JOIN users u ON cs.user_id = u.id
       WHERE cs.id = $1`,
      [id]
    );
    return result.rows[0];
  }
}
