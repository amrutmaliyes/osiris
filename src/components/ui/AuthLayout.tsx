import React from "react";
import DecorativeBackground from "./DecorativeBackground";
import { useTheme } from "../../contexts/ThemeContext";
import BrandLogo from "../BrandLogo";

interface AuthLayoutProps {
  children: React.ReactNode;
  showLogo?: boolean;
  backLink?: React.ReactNode;
}

export default function AuthLayout({
  children,
  showLogo = true,
  backLink,
}: AuthLayoutProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <DecorativeBackground className="flex min-h-screen items-center justify-center p-6">
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute right-6 top-6 z-20 rounded-full bg-[var(--color-surface)]/80 p-2.5 shadow-[var(--shadow-md)] backdrop-blur-sm transition hover:opacity-80"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg className="h-6 w-6 text-[var(--color-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="h-6 w-6 text-[var(--color-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <div className="w-full min-w-[50vw] max-w-[72vw] px-4 sm:px-6">
        {backLink && <div className="mb-4">{backLink}</div>}
        {showLogo && (
          <div className="mb-4 flex justify-center">
            <BrandLogo size="auth" />
          </div>
        )}
        {children}
      </div>
    </DecorativeBackground>
  );
}
