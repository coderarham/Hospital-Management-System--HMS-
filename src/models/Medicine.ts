import mongoose, { Schema, Document } from "mongoose";

export interface IMedicine extends Document {
  name: string;
  category: string;
  stock: number;
  unit: string;
  expiryDate: Date;
  lowStockThreshold: number;
  price: number;
}

const MedicineSchema = new Schema<IMedicine>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    unit: { type: String, default: "tablets" },
    expiryDate: { type: Date, required: true },
    lowStockThreshold: { type: Number, default: 10 },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Medicine || mongoose.model<IMedicine>("Medicine", MedicineSchema);
