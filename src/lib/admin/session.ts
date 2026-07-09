import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Stateless admin session: an HMAC-signed expiry timestamp stored in an
 * httpOnly cookie. The signing key is derived from ADMIN_PASSWORD, so
 * changing the password invalidates every existing session. Server-only —
 * never import from client components.
 */

const COOKIE_NAME = "tuxa_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function signingKey(): Buffer | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(`tuxa-admin-session:${password}`).digest();
}

function sign(expiry: number, key: Buffer): string {
  return createHmac("sha256", key).update(String(expiry)).digest("base64url");
}

/** Constant-time password check (hash first so lengths always match). */
export function passwordMatches(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(password).digest();
  return timingSafeEqual(a, b);
}

export async function createSession(): Promise<void> {
  const key = signingKey();
  if (!key) throw new Error("ADMIN_PASSWORD is not set");
  const expiry = Date.now() + MAX_AGE_SECONDS * 1000;
  const store = await cookies();
  store.set(COOKIE_NAME, `${expiry}.${sign(expiry, key)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

export async function isAuthed(): Promise<boolean> {
  const key = signingKey();
  if (!key) return false;

  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;

  const dot = token.lastIndexOf(".");
  if (dot < 0) return false;
  const expiry = Number(token.slice(0, dot));
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;

  const given = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(sign(expiry, key));
  return given.length === expected.length && timingSafeEqual(given, expected);
}
