import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function Card({
  children,
  className = "",
  title,
  subtitle,
}: CardProps) {
  return (
    <div
      className={[
        "w-full min-h-[260px] rounded-2xl bg-[var(--color-surface)] px-10 py-10 shadow-[var(--shadow-lg)] sm:px-14 sm:py-12",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {(title || subtitle) && (
        <div className="mb-8 text-center">
          {title && (
            <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-3 text-lg text-[var(--color-text-secondary)]">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
