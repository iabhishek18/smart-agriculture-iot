import { Router, Request, Response } from 'express';
import { Reading } from '../models/Reading';

export const readingRoutes = Router();

readingRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const reading = await Reading.create(req.body);
    const config = { moistureThresholdLow: 30, moistureThresholdHigh: 70, autoIrrigation: true };
    res.json({ success: true, data: reading, config });
  } catch (err) { res.status(500).json({ error: 'Failed to save reading' }); }
});

readingRoutes.get('/:deviceId', async (req: Request, res: Response) => {
  const { hours = '24' } = req.query;
  const since = new Date(Date.now() - parseInt(hours as string) * 3600000);
  const readings = await Reading.find({ deviceId: req.params.deviceId, createdAt: { $gte: since } }).sort({ createdAt: -1 }).limit(1000);
  res.json({ success: true, data: readings });
});

readingRoutes.get('/:deviceId/latest', async (req: Request, res: Response) => {
  const latest = await Reading.findOne({ deviceId: req.params.deviceId }).sort({ createdAt: -1 });
  res.json({ success: true, data: latest });
});

readingRoutes.get('/:deviceId/analytics', async (req: Request, res: Response) => {
  const stats = await Reading.aggregate([
    { $match: { deviceId: req.params.deviceId, createdAt: { $gte: new Date(Date.now() - 7 * 86400000) } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, avgMoisture: { $avg: '$soilMoisture' }, avgTemp: { $avg: '$temperature' }, avgHumidity: { $avg: '$humidity' }, maxTemp: { $max: '$temperature' }, minTemp: { $min: '$temperature' } } },
    { $sort: { _id: 1 } }
  ]);
  res.json({ success: true, data: stats });
});
