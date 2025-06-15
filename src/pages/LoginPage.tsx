import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import logo from "../assets/logo.svg";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

interface LoginCredentials {
  email: string;
  password: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setUserRole } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const loginResponse = (await invoke("perform_login", {
        credentials: { email, password } as LoginCredentials,
      })) as { username: string; role: string };

      console.log("Login successful, response:", loginResponse);
      if (loginResponse && loginResponse.role) {
        setUser({ id: null, name: loginResponse.username, role: loginResponse.role });
        setUserRole(loginResponse.role);
        navigate("/home");
      } else {
        setError(t('login_failed_role'));
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err as string);
    }
  };

  return (
    <div className="container mx-auto mt-8 text-center min-h-screen flex items-center justify-center">
      <div className="p-4 bg-white rounded-md shadow-md w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Osiris Logo" className="h-20" />
        </div>
        <h2 className="text-xl font-semibold mb-4">{t('login')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              {t('username')}
            </label>
            <input
              id="email"
              type="text"
              placeholder={t('username')}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              {t('password')}
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t('password')}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
              className="border border-gray-300 p-2 rounded w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0112 3.75c4.286 0 8.293 1.116 11.029 3.713l-.916 1.032M12 3.75v4.125m0 0c-4.121 0-7.721 1.448-10.329 3.607l-.916 1.032c-.781.781-1.559 1.559-2.338 2.338Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full"
            >
              {t('login')}
            </button>
          </div>
        </form>
        {!!error && (
          <div className="mt-4 p-3 rounded bg-red-500 text-white">{error}</div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
