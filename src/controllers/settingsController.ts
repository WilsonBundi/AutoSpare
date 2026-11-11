import { Request, Response } from 'express';
import { SettingsModel } from '../models/Settings';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await SettingsModel.get();
    res.json(settings || {});
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const settings = await SettingsModel.update(req.body);
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update settings' });
  }
};
