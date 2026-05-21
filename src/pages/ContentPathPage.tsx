import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import AppShell, { PageContent, SurfaceCard } from "../components/ui/AppShell";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";

interface ContentPath {
  id: number;
  path: string;
  is_active: boolean;
}

function ContentPathPage() {
  const { userRole } = useAuth();
  const { t } = useLanguage();
  const [contentPaths, setContentPaths] = useState<ContentPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [newPath, setNewPath] = useState("");

  useEffect(() => {
    const fetchContentPaths = async () => {
      try {
        const paths = (await invoke("get_content_paths")) as ContentPath[];
        setContentPaths(paths);
      } catch {
        setError(t("failed_to_load_content_paths"));
      } finally {
        setLoading(false);
      }
    };

    if (userRole === "admin") {
      fetchContentPaths();
    } else {
      setLoading(false);
      setError(t("access_denied_admin_message"));
    }
  }, [userRole, t]);

  const handleBrowseClick = async () => {
    setError(null);
    setMessage(null);
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: t("select_content_folder"),
      });
      if (selected && typeof selected === "string") {
        setNewPath(selected);
      }
    } catch (err: unknown) {
      setError(`${t("error_selecting_content_path")}: ${err}`);
    }
  };

  const handleAddPath = async () => {
    setError(null);
    setMessage(null);
    if (!newPath) {
      setError(t("please_select_directory_first"));
      return;
    }
    try {
      await invoke("add_and_set_active_content_path", { path: newPath });
      setMessage(t("content_path_saved_success"));
      const updatedPaths = (await invoke("get_content_paths")) as ContentPath[];
      setContentPaths(updatedPaths);
      setNewPath("");
    } catch (err: unknown) {
      setError(`${t("error_saving_content_path")} ${err}`);
    }
  };

  const handleSetActive = async (id: number) => {
    setError(null);
    setMessage(null);
    try {
      await invoke("set_active_content_path", { id });
      setMessage(
        t("content_path_set_active_success").replace("{{id}}", id.toString())
      );
      const updatedPaths = (await invoke("get_content_paths")) as ContentPath[];
      setContentPaths(updatedPaths);
    } catch (err: unknown) {
      setError(`${t("error_setting_content_path_active")} ${err}`);
    }
  };

  const handleDeletePath = async (id: number) => {
    setError(null);
    setMessage(null);
    if (window.confirm(t("confirm_delete_content_path"))) {
      try {
        await invoke("delete_content_path", { id });
        setMessage(
          t("content_path_deleted_success").replace("{{id}}", id.toString())
        );
        const updatedPaths = (await invoke("get_content_paths")) as ContentPath[];
        setContentPaths(updatedPaths);
      } catch (err: unknown) {
        setError(`${t("error_deleting_content_path")} ${err}`);
      }
    }
  };

  if (userRole !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-6">
        <SurfaceCard className="max-w-md text-center">
          <h1 className="mb-4 text-2xl font-bold text-[var(--color-error)]">
            {t("access_denied")}
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            {t("permission_denied_message")}
          </p>
        </SurfaceCard>
      </div>
    );
  }

  return (
    <AppShell sidebar={<AdminSidebar />}>
      <PageContent>
        <h1 className="mb-6 text-3xl font-bold text-[var(--color-text)]">
          {t("content_paths")}
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
          </div>
        ) : error && !contentPaths.length ? (
          <div className="rounded-xl bg-[var(--color-error)]/10 p-4 text-[var(--color-error)]">
            {error}
          </div>
        ) : (
          <>
            <SurfaceCard className="mb-6">
              <h2 className="mb-4 text-xl font-semibold text-[var(--color-text)]">
                {t("add_new_content_path")}
              </h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <InputField
                    value={newPath}
                    readOnly
                    placeholder={t("no_directory_selected")}
                    className="mb-0"
                  />
                </div>
                <Button variant="outline" onClick={handleBrowseClick} fullWidth={false}>
                  {t("browse")}
                </Button>
                <Button onClick={handleAddPath} disabled={!newPath} fullWidth={false}>
                  {t("add_path")}
                </Button>
              </div>
              {message && (
                <div className="mt-4 rounded-lg bg-[var(--color-success)]/10 p-3 text-sm text-[var(--color-success)]">
                  {message}
                </div>
              )}
              {error && (
                <div className="mt-4 rounded-lg bg-[var(--color-error)]/10 p-3 text-sm text-[var(--color-error)]">
                  {error}
                </div>
              )}
            </SurfaceCard>

            <SurfaceCard>
              <h2 className="mb-4 text-xl font-semibold text-[var(--color-text)]">
                {t("existing_content_paths")}
              </h2>
              {contentPaths.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
                        <th className="px-4 py-3">{t("id")}</th>
                        <th className="px-4 py-3">{t("path")}</th>
                        <th className="px-4 py-3">{t("status")}</th>
                        <th className="px-4 py-3">{t("actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contentPaths.map((path) => (
                        <tr
                          key={path.id}
                          className="border-b border-[var(--color-divider)]"
                        >
                          <td className="px-4 py-4 text-[var(--color-text)]">
                            {path.id}
                          </td>
                          <td className="max-w-xs break-all px-4 py-4 text-[var(--color-text)]">
                            {path.path}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                path.is_active
                                  ? "bg-[var(--color-success)]/15 text-[var(--color-success)]"
                                  : "bg-[var(--color-text-secondary)]/15 text-[var(--color-text-secondary)]"
                              }`}
                            >
                              {path.is_active
                                ? t("active_status")
                                : t("inactive_status")}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {!path.is_active && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleSetActive(path.id)}
                                  fullWidth={false}
                                >
                                  {t("set_active")}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleDeletePath(path.id)}
                                  fullWidth={false}
                                >
                                  {t("delete_button")}
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[var(--color-text-secondary)]">
                  {t("no_content_paths_found")}
                </p>
              )}
            </SurfaceCard>
          </>
        )}
      </PageContent>
    </AppShell>
  );
}

export default ContentPathPage;
