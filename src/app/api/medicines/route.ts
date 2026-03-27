import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Medicine from "@/models/Medicine";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { role: string } | null;
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const lowStock = searchParams.get("lowStock");

    let query = {};
    if (lowStock === "true") {
      query = { $expr: { $lte: ["$stock", "$lowStockThreshold"] } };
    }

    const medicines = await Medicine.find(query).sort({ name: 1 });
    return NextResponse.json({ success: true, data: medicines });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { role: string } | null;
    if (!decoded || !["Admin", "Pharmacy"].includes(decoded.role))
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await connectDB();
    const body = await req.json();
    const medicine = await Medicine.create(body);
    return NextResponse.json({ success: true, data: medicine }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
