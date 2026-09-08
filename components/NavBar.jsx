"use client";

import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { LogOut, UserRound } from "lucide-react";
import { SITE } from "@/constants";
import ThemeToggle from "./ThemeToggle";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label={`${SITE.name} home`}>
      <Image className="brand-logo" src="/assets/gdg-logo.jpeg" width={42} height={42} alt="GDG on Campus logo" priority />
      <span className="brand-label">{SITE.name}<small>{SITE.campus}</small></span>
    </Link>
  );
}

export default function NavBar() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  return (
    <header className="site-header">
      <nav className="container nav" aria-label="Main navigation">
        <Brand />
        <div className="nav-links">
          <Link href="/departments">Departments</Link>
          <Link href="/departments#how-it-works">How it works</Link>
          {user?.role === "admin" && <Link href="/admin">Review desk</Link>}
        </div>
        <div className="nav-controls">
        <ThemeToggle />
        {isPending ? (
          <span className="nav-action" aria-label="Checking your session">…</span>
        ) : user ? (
          <Link className="nav-action" href="/auth/signout"><LogOut size={15} /> Sign out</Link>
        ) : (
          <Link className="nav-action" href="/auth/signin"><UserRound size={15} /> Sign in</Link>
        )}
        </div>
      </nav>
    </header>
  );
}
