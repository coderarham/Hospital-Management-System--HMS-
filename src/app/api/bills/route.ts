import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Bill from "@/models/Bill";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { id: string; role: string } | null;
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    let query: Record<string, unknown> = {};
    if (decoded.role === "Patient") query.patientId = decoded.id;

    const bills = await Bill.find(query)
      .populate("patientId", "name email")
      .populate("generatedBy", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: bills });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { id: string; role: string } | null;
    if (!decoded || !["Admin", "Reception"].includes(decoded.role))
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await connectDB();
    const body = await req.json();
    const total = body.items.reduce((sum: number, i: { amount: number }) => sum + i.amount, 0);
    const bill = await Bill.create({ ...body, totalAmount: total, generatedBy: decoded.id });
    return NextResponse.json({ success: true, data: bill }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
