import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
  userId: mongoose.Types.ObjectId;
  dateOfBirth?: Date;
  gender?: "Male" | "Female" | "Other";
  bloodGroup?: string;
  address?: string;
  emergencyContact?: { name: string; phone: string; relation: string };
  allergies?: string[];
  pastSurgeries?: { surgeryName: string; date: Date; notes?: string }[];
}

const PatientSchema = new Schema<IPatient>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    bloodGroup: { type: String },
    address: { type: String },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
    allergies: [{ type: String }],
    pastSurgeries: [
      {
        surgeryName: String,
        date: Date,
        notes: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);
