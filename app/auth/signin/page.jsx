"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Brand } from "@/components/NavBar";

const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_SIGN_IN_ENABLED === "true";

function GoogleMark() {
  return <span className="google-mark" aria-hidden="true"><i /><i /><i /><i /></span>;
}

export default function SignInPage() {
  const router = useRouter(); const { data: session, isPending } = authClient.useSession();
  const [mode, setMode] = useState("signin"); const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [submitting, setSubmitting] = useState(false);
  useEffect(() => { if (session?.user && !isPending) router.replace("/"); }, [isPending, router, session?.user]);

  async function submit(event) {
    event.preventDefault(); setError(""); setSubmitting(true);
    try {
      const result = mode === "signup" ? await authClient.signUp.email({ name, email, password, callbackURL: "/" }) : await authClient.signIn.email({ email, password, callbackURL: "/" });
      if (result?.error) throw new Error(result.error.message || "We could not complete that request.");
      router.push("/");
    } catch (failure) { setError(failure.message || "Authentication failed. Please try again."); } finally { setSubmitting(false); }
  }

  async function signInWithGoogle() {
    if (!googleEnabled) return;
    setError(""); setSubmitting(true);
    try {
      const result = await authClient.signIn.social({ provider: "google", callbackURL: "/" });
      if (result?.error) throw new Error(result.error.message || "Google sign-in could not be started.");
    } catch (failure) { setSubmitting(false); setError(failure.message || "Google sign-in could not be started."); }
  }

  return <main className="auth-page"><aside className="auth-aside"><Brand /><div className="auth-message"><p className="eyebrow">Recruitment 2026</p><h1>Good things start with a hello.</h1><p>Sign in to keep your application private, pick your departments, and save your progress as you go.</p></div></aside><section className="auth-panel"><div className="auth-card"><p className="eyebrow">Candidate portal</p><h2>{mode === "signin" ? "Welcome back." : "Let’s begin."}</h2><p>{mode === "signin" ? "Use your account to continue your application." : "Create an account to start and safely save your application."}</p><div className="auth-toggle"><button type="button" className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>Sign in</button><button type="button" className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Create account</button></div>{error && <div className="alert" role="alert">{error}</div>}<form className="auth-form" onSubmit={submit}>{mode === "signup" && <div className="field"><label htmlFor="name">Full name</label><input id="name" required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></div>}<div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></div><div className="field"><label htmlFor="password">Password</label><input id="password" type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "signin" ? "current-password" : "new-password"} /></div><button className="button-primary" disabled={submitting}>{submitting ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}<ArrowRight size={16} /></button></form><div className="auth-divider"><span>or</span></div><button type="button" className="google-button" disabled={!googleEnabled || submitting} onClick={signInWithGoogle}><GoogleMark /> Continue with Google</button>{!googleEnabled && <p className="provider-note">Google sign-in will activate after the Google OAuth credentials and public feature flag are configured.</p>}</div></section></main>;
}
