import brandFull from "../assets/powerbrave-brand.jpg";
import brandIcon from "../assets/powerbrave-icon.png";

type BrandLogoSize = "sm" | "md" | "lg" | "auth";

interface BrandLogoProps {
  size?: BrandLogoSize;
  className?: string;
}

/** Full mark on auth screens (compact); round icon in app chrome */
export default function BrandLogo({ size = "md", className = "" }: BrandLogoProps) {
  if (size === "auth" || size === "lg") {
    const heightClass =
      size === "auth"
        ? "h-[100px] w-auto max-w-[220px]"
        : "h-20 w-auto max-w-[200px]";

    return (
      <img
        src={brandFull}
        alt="PowerBrave Digital Content"
        className={`object-contain ${heightClass} ${className}`}
      />
    );
  }

  const iconSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  return (
    <img
      src={brandIcon}
      alt="PowerBrave"
      className={`object-contain ${iconSize} ${className}`}
    />
  );
}
