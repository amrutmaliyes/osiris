import React from "react";

interface AppShellProps {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export default function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      {sidebar}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

export function PageContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-6 md:p-8 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </div>
  );
}

export function SurfaceCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl bg-[var(--color-surface)] p-6 shadow-[var(--shadow-md)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
