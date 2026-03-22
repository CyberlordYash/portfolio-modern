import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getStore } from "@netlify/blobs";

export type WorklogEntry = {
  id: string;
  date: string;
  title: string;
  note: string;
  createdAt: string;
  updatedAt: string;
};

const STORE_NAME = "portfolio-worklog";
const STORE_KEY = "entries";
const LOCAL_DATA_DIR = path.join(process.cwd(), ".data");
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, "worklog.json");

function isNetlifyRuntime() {
  return Boolean(process.env.NETLIFY || process.env.CONTEXT);
}

export async function readWorklogEntries() {
  if (isNetlifyRuntime()) {
    const store = getStore(STORE_NAME);
    const entries = await store.get(STORE_KEY, { type: "json" });

    return Array.isArray(entries) ? (entries as WorklogEntry[]) : [];
  }

  try {
    const file = await readFile(LOCAL_DATA_FILE, "utf8");
    const parsed = JSON.parse(file) as WorklogEntry[];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function writeWorklogEntries(entries: WorklogEntry[]) {
  if (isNetlifyRuntime()) {
    const store = getStore(STORE_NAME);
    await store.setJSON(STORE_KEY, entries);
    return;
  }

  await mkdir(LOCAL_DATA_DIR, { recursive: true });
  await writeFile(LOCAL_DATA_FILE, JSON.stringify(entries, null, 2), "utf8");
}
