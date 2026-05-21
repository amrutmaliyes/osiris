import BrandLogo from "./BrandLogo";
import { NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import ThemeToggle from "./ui/ThemeToggle";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
    isActive
      ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)]",
  ].join(" ");

function AdminSidebar() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navItems = [
    {
      to: "/home",
      label: t("home_page"),
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      ),
    },
    {
      to: "/content",
      label: t("content"),
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v14m2 0l2.5-.5a2 2 0 002-2V7a2 2 0 00-2-2h-3" />
      ),
    },
    {
      to: "/users",
      label: t("users"),
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      ),
    },
    {
      to: "/settings",
      label: t("settings"),
      icon: (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </>
      ),
    },
  ];

  return (
    <aside className="flex w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-md)]">
      <div className="flex h-20 items-center justify-center border-b border-[var(--color-border)] px-4">
        <BrandLogo size="md" />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={navLinkClass}>
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {item.icon}
            </svg>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center justify-between border-t border-[var(--color-border)] px-4 py-4">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-[var(--color-error)] transition hover:bg-[var(--color-error)]/10"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {t("logout")}
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
