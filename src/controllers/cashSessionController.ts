import { Request, Response } from 'express';
import { CashSessionModel } from '../models/CashSession';

export const openSession = async (req: any, res: Response) => {
  try {
    const session = await CashSessionModel.create({
      user_id: req.user.id,
      opening_balance: req.body.opening_balance,
      notes: req.body.notes,
    });
    res.status(201).json(session);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to open cash session' });
  }
};

export const closeSession = async (req: any, res: Response) => {
  try {
    const { closing_balance, notes } = req.body;
    const session = await CashSessionModel.closeSession(
      parseInt(req.params.id),
      closing_balance,
      notes
    );
    res.json(session);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to close cash session' });
  }
};

export const getActiveSession = async (req: any, res: Response) => {
  try {
    const session = await CashSessionModel.getActiveSession(req.user.id);
    res.json(session || null);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch active session' });
  }
};

export const getSessions = async (req: Request, res: Response) => {
  try {
    const filters: any = {};
    if (req.query.user_id) filters.user_id = parseInt(req.query.user_id as string);
    if (req.query.start_date) filters.start_date = req.query.start_date;
    if (req.query.end_date) filters.end_date = req.query.end_date;

    const sessions = await CashSessionModel.getAll(filters);
    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch sessions' });
  }
};

export const getSession = async (req: Request, res: Response) => {
  try {
    const session = await CashSessionModel.getById(parseInt(req.params.id));
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch session' });
  }
};
