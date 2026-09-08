import { z } from "zod";
import { serverTimestamp } from "firebase-admin/firestore";
import { connect, serializeFirestoreData } from "@/lib/db";
import { apiError, requireAdmin } from "@/lib/server-auth";

const schema = z.object({ shortlisted: z.boolean() });

export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { shortlisted } = schema.parse(await request.json());
    const reference = (await connect()).collection("applications").doc(params.id);
    const snapshot = await reference.get();
    if (!snapshot.exists) return Response.json({ message: "Application not found." }, { status: 404 });
    await reference.update({ shortlisted, status: shortlisted ? "shortlisted" : "submitted", updatedAt: serverTimestamp() });
    const updated = await reference.get();
    return Response.json({ data: { id: updated.id, ...serializeFirestoreData(updated.data()) } });
  } catch (error) { return apiError(error, "Unable to update this application."); }
}
