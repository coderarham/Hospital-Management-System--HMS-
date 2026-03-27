import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

const STAFF_ROLES = ["Reception", "Billing", "Pharmacy", "Lab", "Security"];

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { role: string } | null;
    if (!decoded || decoded.role !== "Admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const query = role ? { role } : { role: { $in: STAFF_ROLES } };

    const staff = await User.find(query).select("-password").populate("departmentId", "name");
    return NextResponse.json({ success: true, data: staff });
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

    if (body.role === "Doctor") {
      const count = await User.countDocuments({ role: "Doctor" });
      body.doctorId = String(count + 1);
    }

    if (STAFF_ROLES.includes(body.role)) {
      const count = await User.countDocuments({ role: { $in: STAFF_ROLES } });
      body.staffId = String(count + 1);
    }

    const user = new User(body);
    await user.save();
    const userObj = user.toObject() as Record<string, unknown>;
    delete userObj.password;
    return NextResponse.json({ success: true, data: userObj }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
