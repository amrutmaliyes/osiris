import { useState, useEffect } from "react";
import UserList from "../components/UserList";
import UserForm from "../components/UserForm";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../contexts/AuthContext";
import { invoke } from "@tauri-apps/api/core";
import { User } from "../types";
import { useLanguage } from "../contexts/LanguageContext";
import AppShell, { PageContent } from "../components/ui/AppShell";
import Button from "../components/ui/Button";

interface BackendUser {
  id?: number | null;
  username: string;
  password?: string;
  role: string;
}

function Users() {
  const { userRole } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await invoke<BackendUser[]>("get_users");
        const mappedUsers: User[] = result.map((user) => ({
          id: user.id || null,
          name: user.username,
          role: user.role,
        }));
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = async (newUserFormData: Omit<User, "id">) => {
    try {
      const userToAdd: BackendUser = {
        username: newUserFormData.name,
        password: newUserFormData.password || "",
        role: newUserFormData.role,
      };
      const id = await invoke<number>("add_user", { user: userToAdd });
      setUsers((prevUsers) => [
        ...prevUsers,
        { ...newUserFormData, id, name: newUserFormData.name },
      ]);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const handleEditUser = async (formData: Omit<User, "id">) => {
    if (currentUser?.id !== null && currentUser?.id !== undefined) {
      try {
        const userToUpdate: BackendUser = {
          id: currentUser.id,
          username: formData.name,
          password: formData.password || "",
          role: formData.role,
        };
        await invoke("update_user", { user: userToUpdate });
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === currentUser.id
              ? { ...currentUser, ...formData, name: formData.name }
              : user
          )
        );
        setShowModal(false);
        setCurrentUser(null);
      } catch (error) {
        console.error("Failed to update user:", error);
      }
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await invoke("delete_user", { id });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <AppShell sidebar={userRole === "admin" ? <AdminSidebar /> : undefined}>
      <PageContent>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[var(--color-text)]">
            {t("user_management")}
          </h1>
          <Button onClick={() => { setCurrentUser(null); setShowModal(true); }} fullWidth={false}>
            {t("add_new_user")}
          </Button>
        </div>

        <UserList
          users={users}
          onEdit={(id) => {
            const userToEdit = users.find((u) => u.id === id);
            if (userToEdit) {
              setCurrentUser(userToEdit);
              setShowModal(true);
            }
          }}
          onDelete={handleDeleteUser}
        />

        <UserForm
          isOpen={showModal}
          onClose={() => { setShowModal(false); setCurrentUser(null); }}
          onSubmit={currentUser ? handleEditUser : handleAddUser}
          initialData={currentUser ? { ...currentUser, password: "" } : null}
        />
      </PageContent>
    </AppShell>
  );
}

export default Users;
