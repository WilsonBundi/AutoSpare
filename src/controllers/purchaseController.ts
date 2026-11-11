import { Request, Response } from 'express';
import { PurchaseModel } from '../models/Purchase';

export const createPurchase = async (req: any, res: Response) => {
  try {
    const { items, ...purchaseData } = req.body;
    purchaseData.user_id = req.user.id;

    const purchase = await PurchaseModel.create(purchaseData, items);
    res.status(201).json(purchase);
  } catch (error: any) {
    console.error('Create purchase error:', error);
    res.status(500).json({ error: error.message || 'Failed to create purchase' });
  }
};

export const getPurchases = async (req: Request, res: Response) => {
  try {
    const filters: any = {};
    if (req.query.start_date) filters.start_date = req.query.start_date;
    if (req.query.end_date) filters.end_date = req.query.end_date;
    if (req.query.supplier_id) filters.supplier_id = parseInt(req.query.supplier_id as string);

    const purchases = await PurchaseModel.getAll(filters);
    res.json(purchases);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch purchases' });
  }
};

export const getPurchase = async (req: Request, res: Response) => {
  try {
    const purchase = await PurchaseModel.findById(parseInt(req.params.id));
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    const items = await PurchaseModel.getPurchaseItems(purchase.id);
    res.json({ ...purchase, items });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch purchase' });
  }
};

export const updatePurchase = async (req: Request, res: Response) => {
  try {
    const purchase = await PurchaseModel.update(parseInt(req.params.id), req.body);
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    res.json(purchase);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update purchase' });
  }
};

export const deletePurchase = async (req: Request, res: Response) => {
  try {
    await PurchaseModel.delete(parseInt(req.params.id));
    res.json({ message: 'Purchase deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete purchase' });
  }
};
