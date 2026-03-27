import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { role: string } | null;
    if (!decoded || decoded.role !== "Admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await connectDB();

    const STAFF_ROLES = ["Reception", "Pharmacy", "Lab", "Security", "Billing"];
    const staffWithoutId = await User.find({
      role: { $in: STAFF_ROLES },
      $or: [{ staffId: { $exists: false } }, { staffId: null }],
    });

    const existing = await User.countDocuments({
      role: { $in: STAFF_ROLES },
      staffId: { $exists: true, $ne: null },
    });

    let counter = existing + 1;
    for (const s of staffWithoutId) {
      await User.findByIdAndUpdate(s._id, { $set: { staffId: String(counter++) } });
    }

    return NextResponse.json({ success: true, updated: staffWithoutId.length });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
