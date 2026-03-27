import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Department from "@/models/Department";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const departments = await Department.find({}).populate("headOfDepartment", "name email");
    return NextResponse.json({ success: true, data: departments });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { role: string } | null;
    if (!decoded || decoded.role !== "Admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await connectDB();
    const body = await req.json();
    const dept = await Department.create(body);
    return NextResponse.json({ success: true, data: dept }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
