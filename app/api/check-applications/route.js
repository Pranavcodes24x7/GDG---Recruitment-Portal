import { connect } from "@/lib/db";
import { getDemoProfile, localDemoEnabled } from "@/lib/local-demo-store";
import { apiError, requireUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireUser();
    if (localDemoEnabled()) {
      const profile = getDemoProfile(session.user.id);
      const submittedDepartments = profile?.departmentNames || [];
      return Response.json({ count: submittedDepartments.length, submittedDepartments });
    }
    const profile = await (await connect()).collection("applicationProfiles").doc(session.user.id).get();
    const departmentIds = profile.exists ? profile.data().departmentIds || [] : [];
    const submittedDepartments = profile.exists ? profile.data().departmentNames || [] : [];
    return Response.json({ count: departmentIds.length, submittedDepartments });
  } catch (error) { return apiError(error, "Unable to check applications."); }
}
