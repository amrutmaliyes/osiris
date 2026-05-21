import React, { useState, useEffect } from "react";
import { User } from "../types";
import { useLanguage } from "../contexts/LanguageContext";
import InputField from "./ui/InputField";
import Button from "./ui/Button";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<User, "id">) => void;
  initialData?: User | null;
}

function UserForm({ isOpen, onClose, onSubmit, initialData }: UserFormProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const { t } = useLanguage();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRole(initialData.role);
      setPassword("");
      setConfirmPassword("");
    } else {
      setName("");
      setPassword("");
      setConfirmPassword("");
      setRole("Admin");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert(t("passwords_do_not_match"));
      return;
    }
    onSubmit({ name, role, password });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[var(--color-surface)] p-8 shadow-[var(--shadow-lg)]">
        <button
          type="button"
          className="absolute right-4 top-4 text-2xl text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="mb-6 text-2xl font-bold text-[var(--color-text)]">
          {initialData ? t("edit_user") : t("add_new_user_form")}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <InputField
            label={t("name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("enter_name")}
            required
          />
          <InputField
            label={t("password")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("enter_password")}
            required
          />
          <InputField
            label={t("confirm_password")}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("re_enter_password")}
            required
          />
          <div className="mb-4">
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]"
            >
              {t("role")}
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="h-14 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            >
              <option>{t("admin_role")}</option>
              <option>{t("user_role")}</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 sm:col-span-2">
            <Button variant="outline" onClick={onClose} fullWidth={false}>
              {t("cancel")}
            </Button>
            <Button type="submit" fullWidth={false}>
              {t("submit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserForm;
