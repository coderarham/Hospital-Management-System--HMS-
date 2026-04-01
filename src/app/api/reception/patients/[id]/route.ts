import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Appointment from "@/models/Appointment";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { role: string } | null;
    if (!decoded || !["Admin", "Reception"].includes(decoded.role))
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const { doctorId, appointmentDate, symptoms, appointmentId, ...userFields } = body;

    if (!userFields.password) delete userFields.password;
    const user = await User.findByIdAndUpdate(id, userFields, { new: true }).select("-password");

    // Update or create appointment
    if (doctorId && appointmentDate) {
      if (appointmentId) {
        await Appointment.findByIdAndUpdate(appointmentId, { doctorId, appointmentDate, symptoms });
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const apptDay = new Date(appointmentDate);
        apptDay.setHours(0, 0, 0, 0);
        const tokenCount = await Appointment.countDocuments({ doctorId, appointmentDate: { $gte: apptDay } });
        await Appointment.create({ patientId: id, doctorId, appointmentDate, symptoms, tokenNumber: tokenCount + 1, status: "Scheduled" });
      }
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { role: string } | null;
    if (!decoded || !["Admin", "Reception"].includes(decoded.role))
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await connectDB();
    const { id } = await params;
    await User.findByIdAndDelete(id);
    await Appointment.deleteMany({ patientId: id });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
