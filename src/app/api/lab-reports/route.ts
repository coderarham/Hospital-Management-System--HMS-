import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LabReport from "@/models/LabReport";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { id: string; role: string } | null;
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    let query: Record<string, unknown> = {};
    if (decoded.role === "Patient") query.patientId = decoded.id;
    else if (decoded.role === "Doctor") query.doctorId = decoded.id;

    const reports = await LabReport.find(query)
      .populate("patientId", "name")
      .populate("doctorId", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: reports });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { id: string; role: string } | null;
    if (!decoded || !["Doctor", "Lab", "Admin"].includes(decoded.role))
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await connectDB();
    const body = await req.json();
    const report = await LabReport.create(body);
    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
