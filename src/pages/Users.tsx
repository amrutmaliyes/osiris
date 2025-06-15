import { useState, useEffect } from 'react';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../contexts/AuthContext';
import { invoke } from '@tauri-apps/api/core';
import { User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

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
        const result = await invoke<BackendUser[]>('get_users');
        const mappedUsers: User[] = result.map(user => ({
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

  const handleAddUser = async (newUserFormData: Omit<User, 'id'>) => {
    try {
      const userToAdd: BackendUser = {
        username: newUserFormData.name,
        password: newUserFormData.password || "",
        role: newUserFormData.role,
      };
      const id = await invoke<number>('add_user', { user: userToAdd });
      setUsers((prevUsers) => [
        ...prevUsers,
        { ...newUserFormData, id: id, name: newUserFormData.name },
      ]);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const handleEditUser = async (formData: Omit<User, 'id'>) => {
    if (currentUser && currentUser.id !== null) {
      try {
        const userToUpdate: BackendUser = {
          id: currentUser.id,
          username: formData.name,
          password: formData.password || "",
          role: formData.role,
        };
        await invoke('update_user', { user: userToUpdate });
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === currentUser.id ? { ...currentUser, ...formData, name: formData.name } : user))
        );
        setShowModal(false);
        setCurrentUser(null);
      } catch (error) {
        console.error("Failed to update user:", error);
      }
    } else {
      console.error("Cannot edit user: no current user or ID is null.");
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await invoke('delete_user', { id: id });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const openAddUserModal = () => {
    setCurrentUser(null);
    setShowModal(true);
  };

  const openEditUserModal = (id: number) => {
    const userToEdit = users.find((user) => user.id === id);
    if (userToEdit) {
      setCurrentUser(userToEdit);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {userRole === "admin" && <AdminSidebar />}
      <div className="flex flex-col flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('user_management')}</h1>
        
        <div className="flex justify-end mb-4">
          <button
            onClick={openAddUserModal}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {t('add_new_user')}
          </button>
        </div>

        <div>
          <UserList users={users} onEdit={openEditUserModal} onDelete={handleDeleteUser} />
        </div>

        <UserForm
          isOpen={showModal}
          onClose={closeModal}
          onSubmit={currentUser ? handleEditUser : handleAddUser}
          initialData={currentUser ? { ...currentUser, password: '' } : null}
        />
      </div>
    </div>
  );
}

export default Users; 