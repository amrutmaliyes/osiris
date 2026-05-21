import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import AuthLayout from "../components/ui/AuthLayout";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

interface LoginCredentials {
  email: string;
  password: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setUserRole } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginResponse = (await invoke("perform_login", {
        credentials: { email, password } as LoginCredentials,
      })) as { username: string; role: string };

      if (loginResponse?.role) {
        setUser({
          id: null,
          name: loginResponse.username,
          role: loginResponse.role,
        });
        setUserRole(loginResponse.role);
        navigate("/home");
      } else {
        setError(t("login_failed_role"));
      }
    } catch (err: unknown) {
      console.error("Login failed:", err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card
        title="Welcome Back"
        subtitle="Sign in to continue to your account"
        className="mx-auto"
      >
        <form onSubmit={handleSubmit}>
          <InputField
            fieldSize="lg"
            label={t("username")}
            placeholder={t("username")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
          <InputField
            fieldSize="lg"
            label={t("password")}
            type={showPassword ? "text" : "password"}
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            required
            autoComplete="current-password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 0112 3.75c4.286 0 8.293 1.116 11.029 3.713M12 3.75v4.125m0 0c-4.121 0-7.721 1.448-10.329 3.607M6.75 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5Z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            }
          />
          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading}
            className="mt-4"
          >
            {loading ? "Signing in..." : t("login")}
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}

export default LoginPage;
