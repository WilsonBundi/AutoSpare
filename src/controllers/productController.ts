import { Request, Response } from 'express';
import { ProductModel } from '../models/Product';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.create(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    console.error('Create product error:', error);
    res.status(500).json({ error: error.message || 'Failed to create product' });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const filters: any = {};
    if (req.query.category_id) filters.category_id = parseInt(req.query.category_id as string);
    if (req.query.search) filters.search = req.query.search as string;

    const products = await ProductModel.getAll(filters);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch products' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.update(parseInt(req.params.id), req.body);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await ProductModel.delete(parseInt(req.params.id));
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete product' });
  }
};

export const getLowStock = async (req: Request, res: Response) => {
  try {
    const threshold = req.query.threshold ? parseInt(req.query.threshold as string) : undefined;
    const products = await ProductModel.getLowStock(threshold);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch low stock products' });
  }
};
