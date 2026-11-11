import { Request, Response } from 'express';
import { ExpenseModel } from '../models/Expense';

export const createExpense = async (req: any, res: Response) => {
  try {
    const expense = await ExpenseModel.create({
      ...req.body,
      user_id: req.user.id
    });
    res.status(201).json(expense);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create expense' });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const filters: any = {};
    if (req.query.start_date) filters.start_date = req.query.start_date;
    if (req.query.end_date) filters.end_date = req.query.end_date;
    if (req.query.category) filters.category = req.query.category;

    const expenses = await ExpenseModel.getAll(filters);
    res.json(expenses);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch expenses' });
  }
};

export const getExpense = async (req: Request, res: Response) => {
  try {
    const expense = await ExpenseModel.getById(parseInt(req.params.id));
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch expense' });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const expense = await ExpenseModel.update(parseInt(req.params.id), req.body);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update expense' });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    await ExpenseModel.delete(parseInt(req.params.id));
    res.json({ message: 'Expense deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete expense' });
  }
};

export const getExpenseSummary = async (req: Request, res: Response) => {
  try {
    const { start_date, end_date } = req.query;
    const summary = await ExpenseModel.getTotalByDateRange(
      start_date as string,
      end_date as string
    );
    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch expense summary' });
  }
};
