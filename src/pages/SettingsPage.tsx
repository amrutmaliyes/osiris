import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import AppShell, { PageContent, SurfaceCard } from "../components/ui/AppShell";
import Button from "../components/ui/Button";

const SettingsPage = () => {
  const { language, setLanguage, t } = useLanguage();
  const { userRole } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleSave = () => {
    setLanguage(selectedLanguage);
  };

  return (
    <AppShell sidebar={userRole === "admin" ? <AdminSidebar /> : undefined}>
      <PageContent className="flex items-center justify-center">
        <SurfaceCard className="w-full max-w-md">
          <h2 className="mb-6 text-center text-2xl font-bold text-[var(--color-text)]">
            {t("settings")}
          </h2>
          <div className="mb-6">
            <label
              htmlFor="language-select"
              className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]"
            >
              {t("select_language")}:
            </label>
            <select
              id="language-select"
              value={selectedLanguage}
              onChange={(e) =>
                setSelectedLanguage(e.target.value as "en" | "kn" | "hi")
              }
              className="h-14 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            >
              <option value="en">{t("english")}</option>
              <option value="kn">{t("kannada")}</option>
              <option value="hi">{t("hindi")}</option>
            </select>
          </div>
          <Button onClick={handleSave} fullWidth>
            {t("save")}
          </Button>
        </SurfaceCard>
      </PageContent>
    </AppShell>
  );
};

export default SettingsPage;
