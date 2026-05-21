import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import BrandLogo from "./BrandLogo";
import logoutIcon from "../assets/logout.svg";
import ThemeToggle from "./ui/ThemeToggle";

function AppHeader() {
  const { user, userRole, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const authPaths = [
    "/activation",
    "/login",
    "/new-activation",
    "/reactivation",
  ];

  if (
    !user ||
    userRole === null ||
    userRole === "admin" ||
    authPaths.includes(location.pathname)
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 shadow-[var(--shadow-md)]">
      <BrandLogo size="md" />
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">
            {t("welcome")}, {user.name}
          </span>
        )}
        <ThemeToggle />
        <Link
          to="/settings"
          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/10"
        >
          {t("settings")}
        </Link>
        {userRole === "User" && (
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-[var(--color-error)] transition hover:bg-[var(--color-error)]/10"
          >
            <img src={logoutIcon} alt="" className="h-4 w-4" />
            <span>{t("logout")}</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default AppHeader;
