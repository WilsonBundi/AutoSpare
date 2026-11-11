import { Request, Response } from 'express';
import { SaleModel } from '../models/Sale';

export const createSale = async (req: any, res: Response) => {
  try {
    const { items, ...saleData } = req.body;
    saleData.user_id = req.user.id;
    saleData.sale_number = await SaleModel.generateSaleNumber();

    const sale = await SaleModel.create(saleData, items);
    res.status(201).json(sale);
  } catch (error: any) {
    console.error('Create sale error:', error);
    res.status(500).json({ error: error.message || 'Failed to create sale' });
  }
};

export const getSales = async (req: Request, res: Response) => {
  try {
    const filters: any = {};
    if (req.query.start_date) filters.start_date = req.query.start_date;
    if (req.query.end_date) filters.end_date = req.query.end_date;
    if (req.query.customer_id) filters.customer_id = parseInt(req.query.customer_id as string);

    const sales = await SaleModel.getAll(filters);
    res.json(sales);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch sales' });
  }
};

export const getSale = async (req: Request, res: Response) => {
  try {
    const sale = await SaleModel.findById(parseInt(req.params.id));
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    const items = await SaleModel.getSaleItems(sale.id);
    res.json({ ...sale, items });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch sale' });
  }
};

export const voidSale = async (req: any, res: Response) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ error: 'Reason is required to void a sale' });
    }

    await SaleModel.voidSale(parseInt(req.params.id), req.user.id, reason);
    res.json({ message: 'Sale voided successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to void sale' });
  }
};
