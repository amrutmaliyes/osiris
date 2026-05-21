import React from "react";

interface DecorativeBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const icons = [
  { d: "M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z", top: "10%", right: "10%", size: 50 },
  { d: "M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 11.5L5.5 9.36 12 5.5l6.5 3.86L12 14.5zM17 13.17v3.33l5-2.5v-3.33l-5 2.5z", bottom: "15%", left: "10%", size: 55 },
  { d: "M12 2c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z", top: "15%", left: "10%", size: 70 },
  { d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-6h2v6zm0-8h-2V7h2v2z", bottom: "20%", right: "10%", size: 65 },
];

export default function DecorativeBackground({
  children,
  className = "",
}: DecorativeBackgroundProps) {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #e1e1ff 0%, var(--color-background) 50%, #f0f0ff 100%)",
        }}
      />
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[var(--color-primary)]/10" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-[var(--color-primary)]/8" />
      <div className="pointer-events-none absolute top-[30%] right-5 h-36 w-36 rotate-45 rounded-2xl bg-white/30 [data-theme=dark]:bg-white/5" />
      {icons.map((icon, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill="var(--color-primary)"
          className="pointer-events-none absolute opacity-40"
          style={{
            width: icon.size,
            height: icon.size,
            top: icon.top,
            right: icon.right,
            bottom: icon.bottom,
            left: icon.left,
          }}
        >
          <path d={icon.d} />
        </svg>
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
