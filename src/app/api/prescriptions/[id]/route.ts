import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Prescription from "@/models/Prescription";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { id: string; role: string } | null;
    if (!decoded || decoded.role !== "Doctor")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const updated = await Prescription.findByIdAndUpdate(id, body, { new: true })
      .populate("patientId", "name patientId phone gender")
      .populate("doctorId", "name specialization");

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
