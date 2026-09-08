"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return <button type="button" className="theme-toggle" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label={`Switch to ${isDark ? "day" : "night"} mode`} title={`Switch to ${isDark ? "day" : "night"} mode`}>
    {isDark ? <Sun size={17} /> : <Moon size={17} />}<span>{isDark ? "Day" : "Night"}</span>
  </button>;
}
