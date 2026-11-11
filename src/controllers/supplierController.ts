import { Request, Response } from 'express';
import { SupplierModel } from '../models/Supplier';

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await SupplierModel.create(req.body);
    res.status(201).json(supplier);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create supplier' });
  }
};

export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await SupplierModel.getAll();
    res.json(suppliers);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch suppliers' });
  }
};

export const getSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await SupplierModel.findById(parseInt(req.params.id));
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch supplier' });
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await SupplierModel.update(parseInt(req.params.id), req.body);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update supplier' });
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    await SupplierModel.delete(parseInt(req.params.id));
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete supplier' });
  }
};
