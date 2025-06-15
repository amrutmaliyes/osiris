import React, { useState, useEffect } from 'react';
import { User } from '../types'; // Import User from centralized types

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<User, 'id'>) => void;
  initialData?: User | null;
}

function UserForm({ isOpen, onClose, onSubmit, initialData }: UserFormProps) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Admin');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRole(initialData.role);
      setPassword('');
      setConfirmPassword('');
    } else {
      handleClearForm();
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    onSubmit({
      name,
      role,
      password
    });
    handleClearForm();
  };

  const handleClearForm = () => {
    setName('');
    setPassword('');
    setConfirmPassword('');
    setRole('Admin');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl relative max-w-2xl w-full">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {initialData ? 'Edit User' : 'Add New User'}
        </h2>
        <div className="">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 pr-10"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* Eye icon for password visibility would go here */}
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password <span className="text-red-500">*</span></label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  autoComplete="new-password"
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 pr-10"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {/* Eye icon for password visibility would go here */}
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role <span className="text-red-500">*</span></label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  autoComplete="role-name"
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option>Admin</option>
                  <option>User</option>
                </select>
              </div>
            </div>

            <div className="pt-5 sm:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserForm; 