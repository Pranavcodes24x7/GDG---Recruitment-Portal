import { createHash } from "crypto";
import { z } from "zod";
import { serverTimestamp } from "firebase-admin/firestore";
import { connect } from "@/lib/db";
import { localDemoEnabled, saveDemoSubmission } from "@/lib/local-demo-store";
import { apiError, requireUser } from "@/lib/server-auth";
import { QuestionnaireData, reviews, SITE } from "@/constants";

export const dynamic = "force-dynamic";

const answerSchema = z.object({ id: z.string().min(1).max(80), question: z.string().min(1).max(500), answer: z.string().max(2000) });
const payloadSchema = z.object({
  requestId: z.string().uuid(),
  profile: z.object({ name: z.string().trim().min(2).max(100), registrationNumber: z.string().trim().regex(/^\d{2}[A-Z]{3}\d{4}$/), phone: z.string().regex(/^\d{10}$/), gender: z.string().max(40), year: z.string().min(1).max(40), motivation: z.string().trim().min(30).max(2500) }),
  applications: z.array(z.object({ departmentId: z.string().min(1), department: z.string().min(1), answers: z.array(answerSchema).max(12) })).min(1).max(SITE.applicationLimit),
});

function applicationId(userId, departmentId) {
  return createHash("sha256").update(`${userId}:${departmentId}`).digest("hex");
}

function validateQuestions(application) {
  const department = reviews.find((item) => item.id === application.departmentId && item.name === application.department);
  if (!department) throw Object.assign(new Error("One of the selected departments is not available."), { status: 400 });
  const questions = QuestionnaireData.find((item) => item.department === department.name)?.questions || [];
  if (application.answers.length !== questions.length) throw Object.assign(new Error("Please answer every question for each selected department."), { status: 400 });
  for (const question of questions) {
    const answer = application.answers.find((item) => item.id === question.id);
    if (!answer || answer.question !== question.name || (question.required && answer.answer.trim().length < 12)) throw Object.assign(new Error("One or more answers are incomplete or invalid."), { status: 400 });
  }
}

function validOrigin(value) {
  try {
    return value ? new URL(value).origin : null;
  } catch {
    return null;
  }
}

export async function POST(request) {
  try {
    const session = await requireUser();
    const deadline = process.env.RECRUITMENT_DEADLINE ? new Date(process.env.RECRUITMENT_DEADLINE) : null;
    if (deadline && !Number.isNaN(deadline.valueOf()) && new Date() > deadline) return Response.json({ message: "Applications are now closed." }, { status: 403 });
    const origin = request.headers.get("origin");
    const allowedOrigins = new Set([validOrigin(request.url), validOrigin(process.env.BETTER_AUTH_URL)].filter(Boolean));
    if (origin && !allowedOrigins.has(origin)) return Response.json({ message: "Invalid request origin." }, { status: 403 });
    const payload = payloadSchema.parse(await request.json());
    if (new Set(payload.applications.map((application) => application.departmentId)).size !== payload.applications.length) throw Object.assign(new Error("Choose each department only once."), { status: 400 });
    payload.applications.forEach(validateQuestions);

    if (localDemoEnabled()) {
      const result = saveDemoSubmission({ user: session.user, profile: payload.profile, applications: payload.applications, requestId: payload.requestId, applicationId, applicationLimit: SITE.applicationLimit });
      return Response.json({ message: result.idempotentRetry ? "Application already received." : "Application received successfully.", submittedDepartments: payload.applications.map((application) => application.department) });
    }

    const db = await connect();
    const profileRef = db.collection("applicationProfiles").doc(session.user.id);
    const applicationRefs = payload.applications.map((application) => db.collection("applications").doc(applicationId(session.user.id, application.departmentId)));
    const result = await db.runTransaction(async (transaction) => {
      const [profileSnapshot, ...existingSnapshots] = await transaction.getAll(profileRef, ...applicationRefs);
      const existing = existingSnapshots.filter((snapshot) => snapshot.exists);
      if (existing.length) {
        const idempotentRetry = existing.length === applicationRefs.length && existing.every((snapshot) => snapshot.data().requestId === payload.requestId);
        if (idempotentRetry) return { idempotentRetry: true };
        throw Object.assign(new Error("You have already submitted an application for one of those departments."), { status: 409 });
      }
      const priorDepartments = profileSnapshot.exists ? profileSnapshot.data().departmentIds || [] : [];
      const priorDepartmentNames = profileSnapshot.exists ? profileSnapshot.data().departmentNames || [] : [];
      if (priorDepartments.length + payload.applications.length > SITE.applicationLimit) throw Object.assign(new Error(`You can apply to up to ${SITE.applicationLimit} departments.`), { status: 409 });
      const now = serverTimestamp();
      transaction.set(profileRef, { userId: session.user.id, email: session.user.email, departmentIds: [...priorDepartments, ...payload.applications.map((application) => application.departmentId)], departmentNames: [...priorDepartmentNames, ...payload.applications.map((application) => application.department)], updatedAt: now, createdAt: profileSnapshot.exists ? profileSnapshot.data().createdAt : now }, { merge: true });
      payload.applications.forEach((application, index) => transaction.create(applicationRefs[index], { userId: session.user.id, email: session.user.email, profile: payload.profile, departmentId: application.departmentId, department: application.department, answers: application.answers, status: "submitted", shortlisted: false, formVersion: 2, requestId: payload.requestId, createdAt: now, updatedAt: now }));
      return { idempotentRetry: false };
    });
    return Response.json({ message: result.idempotentRetry ? "Application already received." : "Application received successfully.", submittedDepartments: payload.applications.map((application) => application.department) });
  } catch (error) { return apiError(error, "Unable to save your application. Please try again."); }
}
