import { connect } from "@/lib/db";
import { getDemoApplications, localDemoEnabled } from "@/lib/local-demo-store";
import { apiError, requireUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = await requireUser();
    const department = new URL(request.url).searchParams.get("department");
    if (!department) return Response.json({ message: "Department is required." }, { status: 400 });
    if (localDemoEnabled()) return Response.json({ submitted: getDemoApplications(session.user.id).some((application) => application.department === department) });
    const snapshot = await (await connect()).collection("applications").where("userId", "==", session.user.id).where("department", "==", department).limit(1).get();
    return Response.json({ submitted: !snapshot.empty });
  } catch (error) { return apiError(error, "Unable to check this application."); }
}
