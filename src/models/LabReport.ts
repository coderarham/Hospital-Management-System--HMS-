import mongoose, { Schema, Document } from "mongoose";

export interface ILabReport extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  testName: string;
  status: "Pending" | "Processing" | "Completed";
  reportUrl?: string;
  result?: string;
  uploadedBy?: mongoose.Types.ObjectId;
}

const LabReportSchema = new Schema<ILabReport>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    testName: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Processing", "Completed"], default: "Pending" },
    reportUrl: { type: String },
    result: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.LabReport || mongoose.model<ILabReport>("LabReport", LabReportSchema);
