import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { readingRoutes } from './routes/readings';
import { zoneRoutes } from './routes/zones';
import { alertRoutes } from './routes/alerts';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/readings', readingRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/alerts', alertRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-agri').then(() => {
  app.listen(5000, () => console.log('Smart Agriculture API on port 5000'));
});
