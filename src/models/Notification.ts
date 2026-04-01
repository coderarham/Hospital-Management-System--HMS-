import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  toRole: string;
  message: string;
  patientId: mongoose.Types.ObjectId;
  appointmentId?: mongoose.Types.ObjectId;
  prescriptionId?: mongoose.Types.ObjectId;
  isRead: boolean;
}

const NotificationSchema = new Schema<INotification>(
  {
    toRole: { type: String, required: true },
    message: { type: String, required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
    prescriptionId: { type: Schema.Types.ObjectId, ref: "Prescription" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
