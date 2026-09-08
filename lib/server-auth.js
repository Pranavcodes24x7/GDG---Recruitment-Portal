import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireUser() {
  const session = await getSession();
  if (!session?.user) {
    const error = new Error("Authentication required");
    error.status = 401;
    throw error;
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireUser();
  if (session.user.role !== "admin") {
    const error = new Error("Administrator access required");
    error.status = 403;
    throw error;
  }
  return session;
}

export function apiError(error, fallback = "Something went wrong") {
  const status = error?.status || 500;
  if (status >= 500) console.error(error);
  return Response.json({ message: status >= 500 ? fallback : error.message }, { status });
}
