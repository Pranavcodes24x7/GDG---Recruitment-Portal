import nodemailer from "nodemailer";
import { z } from "zod";
import { serverTimestamp } from "firebase-admin/firestore";
import { connect } from "@/lib/db";
import { apiError, requireAdmin } from "@/lib/server-auth";

const schema = z.object({ applicationIds: z.array(z.string().min(1)).min(1).max(50), subject: z.string().trim().min(1).max(160), message: z.string().trim().min(1).max(5000) });
const escapeHtml = (value) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);

export async function POST(request) {
  try {
    const session = await requireAdmin();
    if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) return Response.json({ message: "Email delivery is not configured." }, { status: 503 });
    const { applicationIds, subject, message } = schema.parse(await request.json());
    const db = await connect(); const references = applicationIds.map((id) => db.collection("applications").doc(id)); const snapshots = await db.getAll(...references);
    const recipients = snapshots.filter((snapshot) => snapshot.exists).map((snapshot) => ({ id: snapshot.id, ...snapshot.data() }));
    if (!recipients.length) return Response.json({ message: "No matching applications were found." }, { status: 404 });
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD } });
    for (const recipient of recipients) {
      const safeMessage = escapeHtml(message).replace(/\{\{name\}\}/g, escapeHtml(recipient.profile?.name || "there")).replace(/\{\{team\}\}/g, escapeHtml(recipient.department)).replace(/\n/g, "<br />");
      await transporter.sendMail({ from: process.env.EMAIL_USERNAME, to: recipient.email, subject, html: `<div style="font-family:Arial,sans-serif;line-height:1.6">${safeMessage}</div>` });
    }
    await db.collection("adminAudit").add({ actorId: session.user.id, action: "email_sent", applicationIds, sentCount: recipients.length, createdAt: serverTimestamp() });
    return Response.json({ message: "Emails sent.", sentCount: recipients.length });
  } catch (error) { return apiError(error, "Unable to send emails."); }
}
