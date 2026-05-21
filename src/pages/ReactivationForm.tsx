import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { useLanguage } from "../contexts/LanguageContext";
import AuthLayout from "../components/ui/AuthLayout";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

function ReactivationForm() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activationKey, setActivationKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await invoke("perform_reactivation", { activationKey });

      if (result) {
        setSuccess(t("application_reactivated_success"));
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(t("reactivation_failed"));
      }
    } catch (err: unknown) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      backLink={
        <Link
          to="/activation"
          className="inline-flex items-center text-sm font-semibold text-[var(--color-primary)] hover:opacity-80"
        >
          &larr; {t("back_button")}
        </Link>
      }
    >
      <Card title={t("activation_reactivation")}>
        <form onSubmit={handleSubmit} className="space-y-2">
          <InputField
            fieldSize="lg"
            label={t("activation_key")}
            placeholder={t("activation_key")}
            value={activationKey}
            onChange={(e) => setActivationKey(e.target.value)}
            required
          />
          {(error || success) && (
            <div
              className={`mb-4 rounded-lg p-3 text-sm ${
                error
                  ? "bg-[var(--color-error)]/10 text-[var(--color-error)]"
                  : "bg-[var(--color-success)]/10 text-[var(--color-success)]"
              }`}
            >
              {error || success}
            </div>
          )}
          <Button type="submit" size="lg" fullWidth loading={loading} disabled={loading} className="mt-4">
            {t("activate_recheck")}
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}

export default ReactivationForm;
