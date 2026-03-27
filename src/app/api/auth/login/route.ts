import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password, doctorId, staffId } = await req.json();

    // Admin ke liye sirf env se verify karo, DB ki zaroorat nahi
    if (email === process.env.ADMIN_EMAIL) {
      if (password !== process.env.ADMIN_PASSWORD)
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

      const adminUser = await User.findOne({ role: "Admin", isActive: true });
      if (!adminUser) return NextResponse.json({ error: "Admin not found in DB" }, { status: 401 });

      const token = signToken({ id: adminUser._id, role: "Admin", name: adminUser.name });
      const response = NextResponse.json({
        success: true,
        user: { id: adminUser._id, name: adminUser.name, email: adminUser.email, role: "Admin" },
      });
      response.cookies.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7, path: "/" });
      return response;
    }

    const user = await User.findOne({ email, isActive: true }).lean() as Record<string, unknown> | null;
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const userDoc = await User.findOne({ email, isActive: true });
    if (!userDoc) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

      // Doctor portal ke liye Doctor ID verify karo
      if (userDoc.role === "Doctor") {
        if (!doctorId) return NextResponse.json({ error: "Doctor ID required" }, { status: 401 });
        if (String(user.doctorId).trim() !== String(doctorId).trim())
          return NextResponse.json({ error: "Invalid Doctor ID" }, { status: 401 });
      }

      // Staff portals ke liye Staff ID verify karo
      const STAFF_ROLES = ["Reception", "Pharmacy", "Lab", "Security", "Billing"];
      if (STAFF_ROLES.includes(userDoc.role)) {
        if (!staffId) return NextResponse.json({ error: "Staff ID required" }, { status: 401 });
        if (String(user.staffId).trim() !== String(staffId).trim())
          return NextResponse.json({ error: "Invalid Staff ID" }, { status: 401 });
      }

      const isMatch = await userDoc.comparePassword(password);
      if (!isMatch) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = signToken({ id: userDoc._id, role: userDoc.role, name: userDoc.name });

    const response = NextResponse.json({
      success: true,
      user: { id: userDoc._id, name: userDoc.name, email: userDoc.email, role: userDoc.role },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
