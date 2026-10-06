import "server-only";
import crypto from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "./env";

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const authConfigured = () =>
  !!env("ADMIN_EMAIL") && !!env("ADMIN_PASSWORD_HASH") && (env("AUTH_SECRET")?.length ?? 0) >= 32;

const secretKey = () => new TextEncoder().encode(env("AUTH_SECRET"));

const digest = (s: string) => crypto.createHash("sha256").update(s).digest();

/**
 * Stored format: `scrypt:<salt hex>:<hash hex>` — generate one with `npm run admin:hash`.
 * (Not `$`-separated: Next.js expands `$word` inside .env files and would corrupt the value.)
 */
export function verifyPassword(password: string, stored: string) {
  const [scheme, salt, hash] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = crypto.scryptSync(password, Buffer.from(salt, "hex"), expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

/** Always does the full work, so response time doesn't reveal whether the e-mail was right. */
export function checkCredentials(email: string, password: string) {
  if (!authConfigured()) return false;
  const emailOk = crypto.timingSafeEqual(digest(email.trim().toLowerCase()), digest(env("ADMIN_EMAIL")!.toLowerCase()));
  const passOk = verifyPassword(password, env("ADMIN_PASSWORD_HASH")!);
  return emailOk && passOk;
}

export async function startSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (!authConfigured()) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** Call at the top of every admin page AND every server action — actions are public endpoints. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
