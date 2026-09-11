import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { bearerToken } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { DailyLog, Project, User } from "@/lib/models";
import { getMeData } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const token = bearerToken(request);
  const data = await getMeData(token);
  if (!data) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const token = bearerToken(request);
  const conn = await connectDb();
  if (!conn) {
    return NextResponse.json(
      { error: "Database is unavailable. Check MONGODB_URI." },
      { status: 500 }
    );
  }
  const user = await User.findOne({ auth_token: token });
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const project = await Project.findOne({ user_id: user._id });
  if (project) {
    await DailyLog.deleteMany({ project_id: project._id });
    await Project.deleteMany({ user_id: user._id });
  }
  await User.deleteOne({ _id: user._id });
  return NextResponse.json({ ok: true });
}