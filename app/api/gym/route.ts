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
  restDay?: boolean;
};

function sortEntries(entries: GymEntry[]) {
  return [...entries].sort(
    (first, second) =>
      second.date.localeCompare(first.date) ||
      second.updatedAt.localeCompare(first.updatedAt),
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date")?.trim();
  const entries = sortEntries(await readGymEntries());
  const entry = date ? entries.find((item) => item.date === date) ?? null : null;
  const admin = await isAdminAuthorized();

  return NextResponse.json(
    { entries, entry, admin },
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

  const restDay = Boolean(payload.restDay);

  const timestamp = new Date().toISOString();
  const normalizedEntry: GymEntry = {
    date,
    protein: restDay ? false : Boolean(payload.protein),
    creatine: restDay ? false : Boolean(payload.creatine),
    running: restDay ? false : Boolean(payload.running),
    weightLifting: restDay ? false : Boolean(payload.weightLifting),
    abs: restDay ? false : Boolean(payload.abs),
    restDay,
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
      admin: true,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
