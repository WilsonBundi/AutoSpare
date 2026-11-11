import { Request, Response } from 'express';
import { CustomerModel } from '../models/Customer';

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await CustomerModel.create(req.body);
    res.status(201).json(customer);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create customer' });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const filters: any = {};
    if (req.query.search) filters.search = req.query.search as string;

    const customers = await CustomerModel.getAll(filters);
    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch customers' });
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await CustomerModel.findById(parseInt(req.params.id));
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch customer' });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await CustomerModel.update(parseInt(req.params.id), req.body);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update customer' });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    await CustomerModel.delete(parseInt(req.params.id));
    res.json({ message: 'Customer deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete customer' });
  }
};

export const getDebtors = async (req: Request, res: Response) => {
  try {
    const debtors = await CustomerModel.getDebtors();
    res.json(debtors);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch debtors' });
  }
};
