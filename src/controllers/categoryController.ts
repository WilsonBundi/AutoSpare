import { Request, Response } from 'express';
import { CategoryModel } from '../models/Category';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryModel.create(req.body);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create category' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.getAll();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch categories' });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryModel.findById(parseInt(req.params.id));
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch category' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryModel.update(parseInt(req.params.id), req.body);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await CategoryModel.delete(parseInt(req.params.id));
    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete category' });
  }
};
