"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import FormComp from "@/components/FormComp";
import { authClient } from "@/lib/auth-client";
import { reviews } from "@/constants";

export default function JoinPage({ params }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const ids = Array.isArray(params?.joinIds) ? params.joinIds : [];
  const departments = useMemo(() => ids.map((id) => reviews.find((department) => department.id === id)).filter(Boolean), [ids]);
  const valid = ids.length > 0 && ids.length <= 2 && departments.length === ids.length && new Set(ids).size === ids.length;

  if (!valid) return <main className="site-shell"><NavBar /><section className="form-wrap"><div className="form-card success-state"><h1>That route does not look right.</h1><p>Choose one or two departments from the application page to continue.</p><Link className="button-primary" href="/departments">Choose departments</Link></div></section><Footer /></main>;
  if (isPending) return <main className="site-shell"><NavBar /><section className="form-wrap"><p className="eyebrow">Preparing your application…</p></section></main>;
  if (!session?.user) return <main className="site-shell"><NavBar /><section className="form-wrap"><div className="form-card success-state"><h1>Sign in to continue.</h1><p>We use your verified email to keep your application private and prevent duplicate submissions.</p><button className="button-primary" onClick={() => router.push("/auth/signin")}>Sign in</button></div></section><Footer /></main>;

  return <main className="site-shell"><NavBar /><FormComp departments={departments} user={session.user} /><Footer /></main>;
}
