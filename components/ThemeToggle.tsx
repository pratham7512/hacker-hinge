"use client";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function detectSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("hh_theme") as Theme | null;
    const initial: Theme = stored ?? detectSystemTheme();
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("hh_theme", next);
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="rounded-md p-2 border bg-transparent hover:opacity-80"
      style={{ borderColor: "var(--card-border)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={theme === "light" ? "/icons/moon.svg" : "/icons/sun.svg"} alt="theme" className="w-5 h-5" />
    </button>
  );
}


