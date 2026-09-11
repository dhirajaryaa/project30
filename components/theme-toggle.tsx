"use client";

import * as React from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const THEME_KEY = "project30:theme";

function readTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const id = window.setTimeout(() => {
      const next = readTheme();
      applyTheme(next);
      setTheme(next);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light theme" : "Dark theme"}
      onClick={() => {
        const next = theme === "dark" ? "light" : "dark";
        applyTheme(next);
        window.localStorage.setItem(THEME_KEY, next);
        setTheme(next);
      }}
    >
      {theme === "dark" ? <IconSun size={16} /> : <IconMoon size={16} />}
    </Button>
  );
}