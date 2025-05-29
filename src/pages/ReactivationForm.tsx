// src/pages/ReactivationForm.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import logo from "../assets/logo.svg";

function ReactivationForm() {
  const navigate = useNavigate();
  const [activationKey, setActivationKey] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const result = await invoke("perform_reactivation", { activationKey });

      if (result) {
        setSuccess(result as string);
        console.log("Reactivation successful:", result);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError("Reactivation failed.");
        console.error("Reactivation failed:", result);
      }
    } catch (err: any) {
      console.error("Reactivation failed:", err);
      setError(err.toString());
    }
  };

  return (
    <div className="container mx-auto mt-8 text-center min-h-screen flex items-center justify-center">
      <div className="p-4 bg-white rounded-md shadow-xl w-full max-w-2xl">
        <div className="text-left mb-4">
          <Link
            to="/activation"
            className="inline-block text-blue-600 hover:text-blue-800 font-semibold py-1 px-2 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            &larr; Back
          </Link>
        </div>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Osiris Logo" className="h-20" />
        </div>
        <h2 className="text-center text-xl font-semibold text-gray-700 mb-6">
          Activation / Reactivation
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="activationKey"
              className="block text-sm font-medium text-gray-700 sr-only"
            >
              Activation Key
            </label>
            <input
              id="activationKey"
              type="text"
              placeholder="Activation Key"
              value={activationKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setActivationKey(e.target.value)
              }
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Activate / Recheck
            </button>
          </div>
        </form>
        {(!!error || !!success) && (
          <div
            className={`mt-4 p-3 rounded-md text-sm ${
              error ? "bg-red-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            {error || success}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReactivationForm;
