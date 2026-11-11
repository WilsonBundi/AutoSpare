import pool from '../config/database';

export interface Settings {
  id?: number;
  shop_name: string;
  shop_address?: string;
  shop_phone?: string;
  shop_email?: string;
  currency?: string;
  tax_rate?: number;
  receipt_footer?: string;
  logo_url?: string;
  low_stock_alert_threshold?: number;
}

export class SettingsModel {
  static async get(): Promise<any> {
    const result = await pool.query('SELECT * FROM settings ORDER BY id DESC LIMIT 1');
    return result.rows[0];
  }

  static async update(settings: Partial<Settings>): Promise<any> {
    const existing = await this.get();

    if (existing) {
      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      Object.keys(settings).forEach(key => {
        if (settings[key as keyof Settings] !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(settings[key as keyof Settings]);
          paramCount++;
        }
      });

      values.push(existing.id);
      const query = `UPDATE settings SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
      const result = await pool.query(query, values);
      return result.rows[0];
    } else {
      const result = await pool.query(
        `INSERT INTO settings (shop_name, shop_address, shop_phone, shop_email, currency, tax_rate, receipt_footer, logo_url, low_stock_alert_threshold)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          settings.shop_name || 'My Shop',
          settings.shop_address,
          settings.shop_phone,
          settings.shop_email,
          settings.currency || 'KES',
          settings.tax_rate || 16,
          settings.receipt_footer,
          settings.logo_url,
          settings.low_stock_alert_threshold || 10
        ]
      );
      return result.rows[0];
    }
  }
}
