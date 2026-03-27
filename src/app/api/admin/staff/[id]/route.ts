import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { role: string } | null;
    if (!decoded || decoded.role !== "Admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (body.experience) body.experience = Number(body.experience);

    if (body.password && body.password.trim() !== "") {
      // Password change ke liye findById + save use karo taaki pre-save hook chale
      const user = await User.findById(id);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      Object.assign(user, { ...body });
      await user.save();
      const updated = await User.findById(id).select("-password").populate("departmentId", "name");
      return NextResponse.json({ success: true, data: updated });
    } else {
      delete body.password;
      const updated = await User.findByIdAndUpdate(id, body, { new: true })
        .select("-password")
        .populate("departmentId", "name");
      return NextResponse.json({ success: true, data: updated });
    }
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token || "") as { role: string } | null;
    if (!decoded || decoded.role !== "Admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await connectDB();
    const { id } = await params;
    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
