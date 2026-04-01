import mongoose, { Schema, Document } from "mongoose";

export interface IPrescription extends Document {
  rxId?: string;
  appointmentId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  medicines: { medicineName: string; dosage: string; frequency: string; duration: string }[];
  diagnosis?: string;
  notes?: string;
  dispensed: boolean;
}

const PrescriptionSchema = new Schema<IPrescription>(
  {
    rxId: { type: String, unique: true, sparse: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    medicines: [
      {
        medicineName: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
      },
    ],
    diagnosis: { type: String },
    notes: { type: String },
    dispensed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Prescription || mongoose.model<IPrescription>("Prescription", PrescriptionSchema);
