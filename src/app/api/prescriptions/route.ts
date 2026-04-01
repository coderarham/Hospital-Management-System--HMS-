import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Prescription from "@/models/Prescription";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { id: string; role: string } | null;
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    let query: Record<string, unknown> = {};

    if (decoded.role === "Patient") query.patientId = decoded.id;
    else if (decoded.role === "Doctor") {
      query.doctorId = decoded.id;
      if (searchParams.get("patientId")) query.patientId = searchParams.get("patientId");
    }
    else if (decoded.role === "Pharmacy") query.dispensed = false;
    else if (searchParams.get("patientId")) query.patientId = searchParams.get("patientId");

    const prescriptions = await Prescription.find(query)
      .populate("patientId", "name patientId phone gender dateOfBirth address")
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: prescriptions });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { id: string; role: string } | null;
    if (!decoded || decoded.role !== "Doctor")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await connectDB();
    const body = await req.json();
    const count = await Prescription.countDocuments();
    const rxId = `RX${String(count + 1).padStart(5, "0")}`;
    const prescription = await Prescription.create({ ...body, doctorId: decoded.id, rxId });
    return NextResponse.json({ success: true, data: prescription }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
