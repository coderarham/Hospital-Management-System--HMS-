import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectDB();
  const doctors = await User.find({ role: "Doctor", isActive: true })
    .select("name specialization experience departmentId")
    .populate("departmentId", "name")
    .lean();
  return NextResponse.json(doctors);
}
