import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "worklog-session";

function getPassword() {
  return process.env.WORKLOG_PASSWORD ?? "080808";
}

function getSessionSecret() {
  return process.env.WORKLOG_SESSION_SECRET ?? "portfolio-worklog-session";
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function buildSessionToken() {
  return crypto
    .createHash("sha256")
    .update(`${getPassword()}::${getSessionSecret()}`)
    .digest("hex");
}

export function isValidPassword(password: string) {
  return safeEqual(password, getPassword());
}

export async function isWorklogAuthorized() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  return safeEqual(token, buildSessionToken());
}

export async function createWorklogSession() {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, buildSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearWorklogSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
