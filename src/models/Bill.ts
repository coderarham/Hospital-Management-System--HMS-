import mongoose, { Schema, Document } from "mongoose";

export interface IBill extends Document {
  patientId: mongoose.Types.ObjectId;
  appointmentId?: mongoose.Types.ObjectId;
  items: { description: string; amount: number }[];
  totalAmount: number;
  paidAmount: number;
  status: "Pending" | "Paid" | "Partial";
  generatedBy: mongoose.Types.ObjectId;
}

const BillSchema = new Schema<IBill>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
    items: [
      {
        description: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    status: { type: String, enum: ["Pending", "Paid", "Partial"], default: "Pending" },
    generatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Bill || mongoose.model<IBill>("Bill", BillSchema);
