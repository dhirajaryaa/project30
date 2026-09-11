import { NextResponse } from "next/server";
import { newToken } from "@/lib/auth";
import { isValidUsername } from "@/lib/dates";
import { connectDb } from "@/lib/db";
import { Project, User, toProjectDto, toUserDto } from "@/lib/models";

export async function POST(request: Request) {
  const conn = await connectDb();
  if (!conn) {
    return NextResponse.json(
      { error: "Database is unavailable. Check MONGODB_URI." },
      { status: 500 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const username = String(body.username ?? "").trim();
  const display_name = String(body.display_name ?? "").trim() || username;
  const area = String(body.area ?? "").trim();
  const goal = String(body.goal ?? "").trim();
  const start_date = String(body.start_date ?? "").trim();

  if (!isValidUsername(username)) {
    return NextResponse.json(
      {
        error:
          "Username must be 2-30 characters using lowercase letters, numbers, dashes or underscores.",
      },
      { status: 400 }
    );
  }
  if (!area) {
    return NextResponse.json(
      { error: "Tell us the area you want to improve." },
      { status: 400 }
    );
  }
  if (!goal) {
    return NextResponse.json({ error: "Set your 30-day goal." }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start_date)) {
    return NextResponse.json({ error: "Pick a valid start date." }, { status: 400 });
  }

  const existing = await User.findOne({ username: username.toLowerCase() });
  if (existing) {
    return NextResponse.json(
      { error: "That username is already taken." },
      { status: 409 }
    );
  }

  const token = newToken();
  const user = await User.create({
    username: username.toLowerCase(),
    display_name,
    auth_token: token,
  });
  const project = await Project.create({
    user_id: user._id,
    area,
    goal,
    start_date,
    status: "active",
  });

  return NextResponse.json({
    token,
    data: {
      user: toUserDto(user.toObject()),
      project: toProjectDto(project.toObject()),
      logs: [],
    },
  });
}