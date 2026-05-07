import mongoose, { Schema, Document } from 'mongoose';

export interface IReading extends Document {
  deviceId: string;
  zoneId: string;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  lightLevel: number;
  pumpStatus: boolean;
  batteryLevel?: number;
}

const readingSchema = new Schema<IReading>({
  deviceId: { type: String, required: true, index: true },
  zoneId: { type: String, index: true },
  soilMoisture: { type: Number, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  lightLevel: { type: Number, default: 0 },
  pumpStatus: { type: Boolean, default: false },
  batteryLevel: Number,
}, { timestamps: true });

readingSchema.index({ deviceId: 1, createdAt: -1 });

export const Reading = mongoose.model<IReading>('Reading', readingSchema);
