import { Request, Response } from 'express';
import pool from '../config/database';

export const getDailySales = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    const queryDate = date || new Date().toISOString().slice(0, 10);

    const result = await pool.query(
      `SELECT
        COUNT(*) as total_sales,
        SUM(total_amount) as total_revenue,
        SUM(paid_amount) as total_collected,
        COUNT(DISTINCT customer_id) as unique_customers
       FROM sales
       WHERE sale_date::date = $1 AND is_voided = false`,
      [queryDate]
    );

    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch daily sales' });
  }
};

export const getSalesByCategory = async (req: Request, res: Response) => {
  try {
    const { start_date, end_date } = req.query;

    const result = await pool.query(
      `SELECT
        c.name as category,
        COUNT(DISTINCT s.id) as sales_count,
        SUM(si.total_price) as total_revenue,
        SUM(si.quantity) as items_sold
       FROM sales s
       JOIN sale_items si ON s.id = si.sale_id
       JOIN products p ON si.product_id = p.id
       JOIN categories c ON p.category_id = c.id
       WHERE s.is_voided = false
       AND ($1::date IS NULL OR s.sale_date::date >= $1::date)
       AND ($2::date IS NULL OR s.sale_date::date <= $2::date)
       GROUP BY c.name
       ORDER BY total_revenue DESC`,
      [start_date, end_date]
    );

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch sales by category' });
  }
};

export const getTopSellingProducts = async (req: Request, res: Response) => {
  try {
    const { start_date, end_date, limit } = req.query;
    const limitValue = limit ? parseInt(limit as string) : 10;

    const result = await pool.query(
      `SELECT
        p.id,
        p.name,
        p.code,
        c.name as category,
        SUM(si.quantity) as total_sold,
        SUM(si.total_price) as total_revenue,
        COUNT(DISTINCT s.id) as sales_count
       FROM sale_items si
       JOIN sales s ON si.sale_id = s.id
       JOIN products p ON si.product_id = p.id
       JOIN categories c ON p.category_id = c.id
       WHERE s.is_voided = false
       AND ($1::date IS NULL OR s.sale_date::date >= $1::date)
       AND ($2::date IS NULL OR s.sale_date::date <= $2::date)
       GROUP BY p.id, p.name, p.code, c.name
       ORDER BY total_sold DESC
       LIMIT $3`,
      [start_date, end_date, limitValue]
    );

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch top selling products' });
  }
};

export const getProfitReport = async (req: Request, res: Response) => {
  try {
    const { start_date, end_date } = req.query;

    const client = await pool.connect();

    try {
      // Get sales profit
      const salesResult = await client.query(
        `SELECT
          SUM(si.total_price) as total_revenue,
          SUM(si.quantity * p.buying_price) as total_cost,
          SUM(si.total_price - (si.quantity * p.buying_price)) as gross_profit
         FROM sale_items si
         JOIN sales s ON si.sale_id = s.id
         JOIN products p ON si.product_id = p.id
         WHERE s.is_voided = false
         AND ($1::date IS NULL OR s.sale_date::date >= $1::date)
         AND ($2::date IS NULL OR s.sale_date::date <= $2::date)`,
        [start_date, end_date]
      );

      // Get total expenses
      const expenseResult = await client.query(
        `SELECT COALESCE(SUM(amount), 0) as total_expenses
         FROM expenses
         WHERE ($1::date IS NULL OR expense_date >= $1::date)
         AND ($2::date IS NULL OR expense_date <= $2::date)`,
        [start_date, end_date]
      );

      const sales = salesResult.rows[0];
      const expenses = expenseResult.rows[0];

      const totalRevenue = parseFloat(sales.total_revenue) || 0;
      const totalCost = parseFloat(sales.total_cost) || 0;
      const grossProfit = parseFloat(sales.gross_profit) || 0;
      const totalExpenses = parseFloat(expenses.total_expenses) || 0;
      const netProfit = grossProfit - totalExpenses;
      const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : 0;

      res.json({
        total_revenue: totalRevenue,
        total_cost: totalCost,
        gross_profit: grossProfit,
        total_expenses: totalExpenses,
        net_profit: netProfit,
        profit_margin: parseFloat(profitMargin),
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch profit report' });
  }
};

export const getStockValuation = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT
        COUNT(*) as total_products,
        SUM(current_stock) as total_items,
        SUM(current_stock * buying_price) as total_cost_value,
        SUM(current_stock * selling_price) as total_retail_value,
        SUM(current_stock * (selling_price - buying_price)) as potential_profit
       FROM products
       WHERE is_active = true`
    );

    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch stock valuation' });
  }
};

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const [dailySales, lowStock, totalProducts, debtors] = await Promise.all([
      pool.query(
        `SELECT
          COUNT(*) as sales_count,
          COALESCE(SUM(total_amount), 0) as total_revenue
         FROM sales
         WHERE sale_date::date = $1 AND is_voided = false`,
        [today]
      ),
      pool.query(
        `SELECT COUNT(*) as count FROM products WHERE current_stock <= reorder_level AND is_active = true`
      ),
      pool.query(
        `SELECT COUNT(*) as count, SUM(current_stock) as total_items FROM products WHERE is_active = true`
      ),
      pool.query(
        `SELECT COUNT(*) as count, COALESCE(SUM(current_balance), 0) as total_debt FROM customers WHERE current_balance > 0 AND is_active = true`
      )
    ]);

    res.json({
      today: dailySales.rows[0],
      low_stock: lowStock.rows[0],
      inventory: totalProducts.rows[0],
      debtors: debtors.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch dashboard summary' });
  }
};
