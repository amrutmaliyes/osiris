import React, { forwardRef } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
  fieldSize?: "md" | "lg";
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, rightElement, fieldSize = "md", className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="mb-4 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={[
              "mb-2 block font-medium text-[var(--color-text-secondary)]",
              fieldSize === "lg" ? "text-base" : "text-sm",
            ].join(" ")}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={[
              fieldSize === "lg" ? "h-16 text-lg" : "h-14",
              "w-full rounded-xl border bg-[var(--color-surface)] px-4 text-[var(--color-text)]",
              "placeholder:text-[var(--color-text-secondary)]",
              "transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20",
              error ? "border-[var(--color-error)]" : "border-[var(--color-border)]",
              rightElement ? "pr-12" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-[var(--color-error)]">{error}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
