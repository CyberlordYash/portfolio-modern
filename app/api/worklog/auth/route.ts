import { NextResponse } from "next/server";
import {
  clearWorklogSession,
  createWorklogSession,
  isValidPassword,
  isWorklogAuthorized,
} from "@/lib/worklog-auth";

export async function GET() {
  const authorized = await isWorklogAuthorized();

  return NextResponse.json(
    { authorized },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  const password = body.password?.trim() ?? "";

  if (!isValidPassword(password)) {
    return NextResponse.json(
      { authorized: false, error: "Invalid password" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  await createWorklogSession();

  return NextResponse.json(
    { authorized: true },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function DELETE() {
  await clearWorklogSession();

  return NextResponse.json(
    { authorized: false },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
