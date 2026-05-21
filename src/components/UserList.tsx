import { User } from "../types";
import { useLanguage } from "../contexts/LanguageContext";
import { SurfaceCard } from "./ui/AppShell";
import Button from "./ui/Button";

interface UserListProps {
  users: User[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

function UserList({ users, onEdit, onDelete }: UserListProps) {
  const { t } = useLanguage();

  return (
    <SurfaceCard>
      <h2 className="mb-4 text-xl font-semibold text-[var(--color-text)]">
        {t("users")}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
              <th className="px-4 py-3">{t("id")}</th>
              <th className="px-4 py-3">{t("name")}</th>
              <th className="px-4 py-3">{t("role")}</th>
              <th className="px-4 py-3">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[var(--color-divider)]"
              >
                <td className="px-4 py-4 text-[var(--color-text)]">{user.id}</td>
                <td className="px-4 py-4 text-[var(--color-text)]">{user.name}</td>
                <td className="px-4 py-4 text-[var(--color-text-secondary)]">
                  {user.role}
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    {user.id !== null && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(user.id!)}
                          fullWidth={false}
                        >
                          {t("edit_user")}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => onDelete(user.id!)}
                          fullWidth={false}
                        >
                          {t("delete_button")}
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SurfaceCard>
  );
}

export default UserList;
