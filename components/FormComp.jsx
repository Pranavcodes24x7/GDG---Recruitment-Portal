"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { QuestionnaireData } from "@/constants";
import { useSubmissions } from "@/components/SubmissionsProvider";

const initialValues = (user) => ({
  name: user.name || "", registrationNumber: "", phone: "", gender: "", year: "", motivation: "", answers: {},
});

function validate(values, departments) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your full name.";
  if (!/^\d{2}[A-Z]{3}\d{4}$/.test(values.registrationNumber.trim())) errors.registrationNumber = "Use the format 25BCE1234.";
  if (!/^\d{10}$/.test(values.phone.trim())) errors.phone = "Enter a 10-digit phone number.";
  if (!values.year) errors.year = "Please select your year of study.";
  if (values.motivation.trim().length < 30) errors.motivation = "Tell us a little more—at least 30 characters.";
  departments.forEach((department) => {
    const questions = QuestionnaireData.find((group) => group.department === department.name)?.questions || [];
    questions.filter((question) => question.required).forEach((question) => {
      if ((values.answers[question.id] || "").trim().length < 12) errors[`answer-${question.id}`] = "Please add a thoughtful response.";
    });
  });
  return errors;
}

export default function FormComp({ departments, user }) {
  const draftKey = `gdg-application-draft:${user.id}:${departments.map((department) => department.id).sort().join("-")}`;
  const [values, setValues] = useState(() => initialValues(user));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { markDepartmentsSubmitted } = useSubmissions();

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(draftKey);
      if (saved) setValues((current) => ({ ...current, ...JSON.parse(saved), name: JSON.parse(saved).name || user.name || "" }));
    } catch { /* A malformed local draft should never block the application. */ }
  }, [draftKey, user.name]);
  useEffect(() => {
    const timer = window.setTimeout(() => sessionStorage.setItem(draftKey, JSON.stringify(values)), 350);
    return () => window.clearTimeout(timer);
  }, [draftKey, values]);

  const departmentQuestions = useMemo(() => departments.map((department) => ({ department, questions: QuestionnaireData.find((group) => group.department === department.name)?.questions || [] })), [departments]);
  const setField = (field, value) => setValues((current) => ({ ...current, [field]: value }));
  const setAnswer = (id, value) => setValues((current) => ({ ...current, answers: { ...current.answers, [id]: value } }));

  async function submit(event) {
    event.preventDefault();
    const nextErrors = validate(values, departments); setErrors(nextErrors); setSubmitError("");
    if (Object.keys(nextErrors).length) { document.querySelector(".field-error")?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    setSubmitting(true);
    try {
      const requestId = crypto.randomUUID();
      const applications = departmentQuestions.map(({ department, questions }) => ({
        departmentId: department.id, department: department.name,
        answers: questions.map((question) => ({ id: question.id, question: question.name, answer: values.answers[question.id]?.trim() || "" })),
      }));
      const response = await fetch("/api/submit-form", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ requestId, profile: { name: values.name.trim(), registrationNumber: values.registrationNumber.trim(), phone: values.phone.trim(), gender: values.gender, year: values.year, motivation: values.motivation.trim() }, applications }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "We could not save your application.");
      sessionStorage.removeItem(draftKey); markDepartmentsSubmitted(departments.map((department) => department.name)); setSubmitted(true);
    } catch (error) { setSubmitError(error.message || "Something went wrong. Your answers are still saved in this browser."); }
    finally { setSubmitting(false); }
  }

  if (submitted) return <section className="form-wrap"><div className="form-card success-state"><span className="success-icon"><CheckCircle2 size={28} /></span><p className="eyebrow">Application received</p><h1>You are on the list.</h1><p>We saved your application for {departments.map((department) => department.name).join(" and ")}. Keep an eye on your email for the next step.</p><Link className="button-primary" href="/departments">Back to departments <ArrowRight size={16} /></Link></div></section>;

  return <section className="form-wrap">
    <div className="form-intro"><p className="eyebrow">Step 02 · Your application</p><h1 className="display">Tell us how you think.</h1><p>Applying for <strong>{departments.map((department) => department.name).join(" + ")}</strong>. Your draft is saved in this browser while you work.</p></div>
    <form className="form-card" onSubmit={submit} noValidate>
      {submitError && <div className="alert" role="alert">{submitError}</div>}
      <section className="form-section"><h2>Start with you</h2><p>Your email is verified through your sign-in: <strong>{user.email}</strong></p><div className="field-grid">
        <Field label="Full name" error={errors.name}><input value={values.name} onChange={(event) => setField("name", event.target.value)} autoComplete="name" /></Field>
        <Field label="Registration number" hint="e.g. 25BCE1234" error={errors.registrationNumber}><input value={values.registrationNumber} onChange={(event) => setField("registrationNumber", event.target.value.toUpperCase())} maxLength={9} autoComplete="off" /></Field>
        <Field label="Phone number" hint="WhatsApp preferred" error={errors.phone}><input inputMode="numeric" value={values.phone} onChange={(event) => setField("phone", event.target.value.replace(/\D/g, "").slice(0, 10))} autoComplete="tel" /></Field>
        <Field label="Year of study" error={errors.year}><select value={values.year} onChange={(event) => setField("year", event.target.value)}><option value="">Select year</option><option>First year</option><option>Second year</option><option>Third year</option><option>Fourth year</option><option>Other</option></select></Field>
        <Field label="Gender" hint="Optional"><select value={values.gender} onChange={(event) => setField("gender", event.target.value)}><option value="">Prefer not to say</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Self-describe</option></select></Field>
        <Field label="Why do you want to join?" hint="Required" error={errors.motivation} full><textarea value={values.motivation} onChange={(event) => setField("motivation", event.target.value)} placeholder="What are you hoping to explore, contribute, or learn with this community?" /></Field>
      </div></section>
      {departmentQuestions.map(({ department, questions }) => <section className="form-section" key={department.id}><h2>{department.name}</h2><p>There are no perfect answers. Be specific, be honest, and let your curiosity show.</p><div className="field-grid">{questions.map((question) => <Field key={question.id} label={question.name} hint={question.required ? "Required" : "Optional"} error={errors[`answer-${question.id}`]} full={question.type !== "short-text"}>{question.type === "short-text" ? <input value={values.answers[question.id] || ""} onChange={(event) => setAnswer(question.id, event.target.value)} placeholder={question.placeholder} /> : <textarea value={values.answers[question.id] || ""} onChange={(event) => setAnswer(question.id, event.target.value)} placeholder={question.placeholder} />}</Field>)}</div></section>)}
      <div className="form-submit"><p>By submitting, you confirm that your details are accurate. We only use them for this recruitment process.</p><button className="button-primary" type="submit" disabled={submitting}>{submitting ? "Saving your application…" : "Submit application"} <ArrowRight size={16} /></button></div>
    </form>
  </section>;
}

function Field({ label, hint, error, full, children }) { return <div className={`field ${full ? "full" : ""}`}><label>{label}{hint && <em>{hint}</em>}</label>{children}{error && <p className="field-error">{error}</p>}</div>; }
