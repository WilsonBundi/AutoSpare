import pool from '../config/database';

export interface User {
  id?: number;
  username: string;
  password: string;
  full_name: string;
  email?: string;
  phone?: string;
  role_id: number;
  is_active?: boolean;
}

export class UserModel {
  static async create(user: User): Promise<any> {
    const result = await pool.query(
      'INSERT INTO users (username, password, full_name, email, phone, role_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user.username, user.password, user.full_name, user.email, user.phone, user.role_id]
    );
    return result.rows[0];
  }

  static async findByUsername(username: string): Promise<any> {
    const result = await pool.query(
      'SELECT u.*, r.name as role_name, r.permissions FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.username = $1',
      [username]
    );
    return result.rows[0];
  }

  static async findById(id: number): Promise<any> {
    const result = await pool.query(
      'SELECT u.*, r.name as role_name, r.permissions FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async getAll(): Promise<any[]> {
    const result = await pool.query(
      'SELECT u.*, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id ORDER BY u.created_at DESC'
    );
    return result.rows;
  }

  static async update(id: number, user: Partial<User>): Promise<any> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.keys(user).forEach(key => {
      if (user[key as keyof User] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(user[key as keyof User]);
        paramCount++;
      }
    });

    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }

  static async updateLastLogin(id: number): Promise<void> {
    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [id]);
  }
}
