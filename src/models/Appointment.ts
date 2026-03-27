import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  departmentId?: mongoose.Types.ObjectId;
  appointmentDate: Date;
  status: "Scheduled" | "Completed" | "Cancelled" | "No-Show";
  symptoms?: string;
  notes?: string;
  tokenNumber?: number;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department" },
    appointmentDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "No-Show"],
      default: "Scheduled",
    },
    symptoms: { type: String },
    notes: { type: String },
    tokenNumber: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment", AppointmentSchema);
