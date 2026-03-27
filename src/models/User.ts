import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "Admin" | "Doctor" | "Patient" | "Reception" | "Pharmacy" | "Lab" | "Security" | "Billing";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  departmentId?: mongoose.Types.ObjectId;
  isActive: boolean;
  gender?: string;
  experience?: number;
  address?: string;
  specialization?: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Doctor", "Patient", "Reception", "Pharmacy", "Lab", "Security", "Billing"],
    },
    phone: { type: String },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department" },
    isActive: { type: Boolean, default: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    experience: { type: Number },
    address: { type: String },
    specialization: { type: String },
    doctorId: { type: String, unique: true, sparse: true },
    staffId: { type: String, unique: true, sparse: true },
    staffId: { type: String, unique: true, sparse: true },
    shift: { type: String },
    joiningDate: { type: String },
    state: { type: String },
    city: { type: String },
    pincode: { type: String },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

// Force schema refresh to pick up new fields like staffId
if (mongoose.models.User) delete (mongoose.models as Record<string, unknown>).User;
export default mongoose.model<IUser>("User", UserSchema);
