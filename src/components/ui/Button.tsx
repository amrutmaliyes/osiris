import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "text" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-background)] hover:opacity-90 border-transparent",
  secondary:
    "bg-[var(--color-secondary)] text-white hover:opacity-90 border-transparent",
  outline:
    "bg-transparent text-[var(--color-primary)] border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10",
  text: "bg-transparent text-[var(--color-primary)] border-transparent hover:bg-[var(--color-primary)]/10",
  danger:
    "bg-[var(--color-error)] text-white hover:opacity-90 border-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-12 px-5 text-base",
  lg: "h-14 px-6 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center rounded-lg border font-semibold transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading ? (
        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </button>
  );
}
