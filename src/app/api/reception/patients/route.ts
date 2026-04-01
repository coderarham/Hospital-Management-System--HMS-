import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Appointment from "@/models/Appointment";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { role: string } | null;
    if (!decoded || !["Admin", "Reception", "Doctor"].includes(decoded.role))
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await connectDB();
    const patients = await User.find({ role: "Patient" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // Fetch latest appointment for each patient
    const patientIds = patients.map((p) => p._id);
    const appointments = await Appointment.find({ patientId: { $in: patientIds } })
      .populate("doctorId", "name specialization")
      .sort({ appointmentDate: -1 })
      .lean();

    const apptMap: Record<string, unknown> = {};
    for (const a of appointments) {
      const pid = String(a.patientId);
      if (!apptMap[pid]) apptMap[pid] = a;
    }

    const result = patients.map((p) => ({ ...p, appointment: apptMap[String(p._id)] || null }));
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { role: string } | null;
    if (!decoded || !["Admin", "Reception"].includes(decoded.role))
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await connectDB();
    const body = await req.json();
    const { doctorId, appointmentDate, symptoms, name, email, password, phone, address, state, city, pincode, gender, dateOfBirth } = body;

    // Generate patientId
    const count = await User.countDocuments({ role: "Patient" });
    const patientId = `PAT${String(count + 1).padStart(4, "0")}`;

    const user = await User.create({
      name, email, password, phone, role: "Patient",
      address, state, city, pincode, gender, dateOfBirth,
      patientId,
    });

    let appointment = null;
    if (doctorId && appointmentDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const apptDay = new Date(appointmentDate);
      apptDay.setHours(0, 0, 0, 0);
      const tokenCount = await Appointment.countDocuments({ doctorId, appointmentDate: { $gte: apptDay } });
      appointment = await Appointment.create({
        patientId: user._id,
        doctorId,
        appointmentDate,
        symptoms,
        tokenNumber: tokenCount + 1,
        status: "Scheduled",
      });
    }

    return NextResponse.json({ success: true, data: { user, appointment } }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
