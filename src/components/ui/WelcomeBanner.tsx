interface WelcomeBannerProps {
  username: string;
  subtitle?: string;
}

export default function WelcomeBanner({
  username,
  subtitle = "What would you like to explore today?",
}: WelcomeBannerProps) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-md)]">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)]/90 to-[var(--color-primary)]/70" />
      <div className="relative px-6 py-8">
        <h1 className="text-2xl font-bold text-[var(--color-background)] md:text-3xl">
          Welcome Back, {username}!
        </h1>
        <p className="mt-2 text-[var(--color-background)]/90">{subtitle}</p>
      </div>
    </div>
  );
}
