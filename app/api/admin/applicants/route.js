import { connect, serializeFirestoreData } from "@/lib/db";
import { apiError, requireAdmin } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdmin();
    const searchParams = new URL(request.url).searchParams;
    const requestedLimit = Number(searchParams.get("limit") || 50);
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 50;
    const snapshot = await (await connect()).collection("applications").orderBy("createdAt", "desc").limit(limit).get();
    return Response.json({ applicants: snapshot.docs.map((document) => ({ id: document.id, ...serializeFirestoreData(document.data()) })), hasMore: snapshot.size === limit });
  } catch (error) { return apiError(error, "Unable to load applicants."); }
}
