import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { id: string; role: string } | null;
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    let query: Record<string, unknown> = {};

    if (decoded.role === "Doctor") query.doctorId = decoded.id;
    else if (decoded.role === "Patient") query.patientId = decoded.id;
    else if (searchParams.get("doctorId")) query.doctorId = searchParams.get("doctorId");
    else if (searchParams.get("patientId")) query.patientId = searchParams.get("patientId");

    const appointments = await Appointment.find(query)
      .populate("patientId", "name email phone")
      .populate("doctorId", "name")
      .populate("departmentId", "name")
      .sort({ appointmentDate: -1 });

    return NextResponse.json({ success: true, data: appointments });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { id: string; role: string } | null;
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    // Count today's appointments for token number
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await Appointment.countDocuments({
      doctorId: body.doctorId,
      appointmentDate: { $gte: today },
    });

    const appointment = await Appointment.create({ ...body, tokenNumber: count + 1 });
    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
