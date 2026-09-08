import { connect, serializeFirestoreData } from "@/lib/db";
import { getDemoApplications, localDemoEnabled } from "@/lib/local-demo-store";
import { apiError, requireUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireUser();
    if (localDemoEnabled()) return Response.json({ data: getDemoApplications(session.user.id) });
    const snapshot = await (await connect()).collection("applications").where("userId", "==", session.user.id).get();
    return Response.json({ data: snapshot.docs.map((document) => ({ id: document.id, ...serializeFirestoreData(document.data()) })) });
  } catch (error) { return apiError(error, "Unable to load applications."); }
}
