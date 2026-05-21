interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
      <p className="mt-4 text-lg font-medium text-white">{message}</p>
    </div>
  );
}
