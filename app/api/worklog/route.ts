import { NextResponse } from "next/server";
import { isWorklogAuthorized } from "@/lib/worklog-auth";
import {
  readWorklogEntries,
  writeWorklogEntries,
  WorklogEntry,
} from "@/lib/worklog-store";

type EntryPayload = {
  id?: string;
  date?: string;
  title?: string;
  note?: string;
};

function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized" },
    {
      status: 401,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

function sortEntries(entries: WorklogEntry[]) {
  return [...entries].sort((first, second) => {
    return (
      second.date.localeCompare(first.date) ||
      second.updatedAt.localeCompare(first.updatedAt)
    );
  });
}

function validateEntry(payload: EntryPayload) {
  const date = payload.date?.trim() ?? "";
  const title = payload.title?.trim() ?? "";
  const note = payload.note?.trim() ?? "";

  if (!date || !title || !note) {
    return null;
  }

  return { date, title, note };
}

export async function GET() {
  if (!(await isWorklogAuthorized())) {
    return unauthorizedResponse();
  }

  const entries = sortEntries(await readWorklogEntries());

  return NextResponse.json(
    { entries },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: Request) {
  if (!(await isWorklogAuthorized())) {
    return unauthorizedResponse();
  }

  const payload = (await request.json()) as EntryPayload;
  const validated = validateEntry(payload);

  if (!validated) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const existingEntries = await readWorklogEntries();
  const timestamp = new Date().toISOString();
  const entryId = payload.id?.trim();

  const nextEntries = entryId
    ? existingEntries.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              ...validated,
              updatedAt: timestamp,
            }
          : entry,
      )
    : [
        {
          id: crypto.randomUUID(),
          ...validated,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        ...existingEntries,
      ];

  const entryExists = entryId
    ? nextEntries.some((entry) => entry.id === entryId)
    : true;

  if (entryId && !entryExists) {
    return NextResponse.json(
      { error: "Entry not found" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  const sortedEntries = sortEntries(nextEntries);
  await writeWorklogEntries(sortedEntries);

  return NextResponse.json(
    { entries: sortedEntries },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function DELETE(request: Request) {
  if (!(await isWorklogAuthorized())) {
    return unauthorizedResponse();
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();

  if (!id) {
    return NextResponse.json(
      { error: "Missing entry id" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const existingEntries = await readWorklogEntries();
  const nextEntries = existingEntries.filter((entry) => entry.id !== id);

  if (nextEntries.length === existingEntries.length) {
    return NextResponse.json(
      { error: "Entry not found" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  const sortedEntries = sortEntries(nextEntries);
  await writeWorklogEntries(sortedEntries);

  return NextResponse.json(
    { entries: sortedEntries },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
