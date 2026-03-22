import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { GymEntry, readGymEntries, writeGymEntries } from "@/lib/gym-store";

type GymPayload = {
  date?: string;
  protein?: boolean;
  creatine?: boolean;
  running?: boolean;
  weightLifting?: boolean;
  abs?: boolean;
};

function sortEntries(entries: GymEntry[]) {
  return [...entries].sort(
    (first, second) =>
      second.date.localeCompare(first.date) ||
      second.updatedAt.localeCompare(first.updatedAt),
  );
}

export async function GET(request: Request) {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date")?.trim();
  const entries = sortEntries(await readGymEntries());
  const entry = date ? entries.find((item) => item.date === date) ?? null : null;

  return NextResponse.json(
    { entries, entry },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: Request) {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const payload = (await request.json()) as GymPayload;
  const date = payload.date?.trim() ?? "";

  if (!date) {
    return NextResponse.json(
      { error: "Missing date" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const timestamp = new Date().toISOString();
  const normalizedEntry: GymEntry = {
    date,
    protein: Boolean(payload.protein),
    creatine: Boolean(payload.creatine),
    running: Boolean(payload.running),
    weightLifting: Boolean(payload.weightLifting),
    abs: Boolean(payload.abs),
    updatedAt: timestamp,
  };

  const existingEntries = await readGymEntries();
  const hasExisting = existingEntries.some((entry) => entry.date === date);

  const nextEntries = hasExisting
    ? existingEntries.map((entry) =>
        entry.date === date ? normalizedEntry : entry,
      )
    : [normalizedEntry, ...existingEntries];

  const sortedEntries = sortEntries(nextEntries);
  await writeGymEntries(sortedEntries);

  return NextResponse.json(
    {
      entries: sortedEntries,
      entry: normalizedEntry,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
