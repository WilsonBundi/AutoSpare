import { Request, Response } from 'express';
import { SupplierPricingModel } from '../models/SupplierPricing';

export const createSupplierPricing = async (req: Request, res: Response) => {
  try {
    const pricing = await SupplierPricingModel.create(req.body);
    res.status(201).json(pricing);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create supplier pricing' });
  }
};

export const getSupplierPricing = async (req: Request, res: Response) => {
  try {
    const pricing = await SupplierPricingModel.getBySupplier(parseInt(req.params.supplierId));
    res.json(pricing);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch supplier pricing' });
  }
};

export const getProductPricing = async (req: Request, res: Response) => {
  try {
    const pricing = await SupplierPricingModel.getByProduct(parseInt(req.params.productId));
    res.json(pricing);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch product pricing' });
  }
};

export const deleteSupplierPricing = async (req: Request, res: Response) => {
  try {
    await SupplierPricingModel.delete(
      parseInt(req.params.supplierId),
      parseInt(req.params.productId)
    );
    res.json({ message: 'Supplier pricing deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete supplier pricing' });
  }
};
