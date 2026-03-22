import { NextResponse } from "next/server";
import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthorized,
  isValidAdminPassword,
} from "@/lib/admin-auth";

export async function GET() {
  const authorized = await isAdminAuthorized();

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

  if (!isValidAdminPassword(password)) {
    return NextResponse.json(
      { authorized: false, error: "Invalid password" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  await createAdminSession();

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
  await clearAdminSession();

  return NextResponse.json(
    { authorized: false },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
