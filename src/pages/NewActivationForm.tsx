import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { useLanguage } from "../contexts/LanguageContext";
import AuthLayout from "../components/ui/AuthLayout";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

interface NewActivationFormData {
  institutionName: string;
  headOfInstitution: string;
  mobileNo: string;
  serialNumber: string;
  productKey: string;
}

function NewActivationForm() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState<NewActivationFormData>({
    institutionName: "",
    headOfInstitution: "",
    mobileNo: "",
    serialNumber: "",
    productKey: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await invoke("perform_new_activation", { formData });

      if (result) {
        setSuccess(t("application_activated_success"));
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(t("activation_failed"));
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
      <Card title={t("activation_title")}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <InputField
              fieldSize="lg"
              name="institutionName"
              label={t("institution_name")}
              placeholder={t("institution_name")}
              value={formData.institutionName}
              onChange={handleChange}
              required
            />
            <InputField
              fieldSize="lg"
              name="headOfInstitution"
              label={t("head_of_institution")}
              placeholder={t("head_of_institution")}
              value={formData.headOfInstitution}
              onChange={handleChange}
              required
            />
            <InputField
              fieldSize="lg"
              name="mobileNo"
              type="tel"
              label={t("mobile_no")}
              placeholder={t("mobile_no")}
              value={formData.mobileNo}
              onChange={handleChange}
              required
            />
            <InputField
              fieldSize="lg"
              name="serialNumber"
              label={t("serial_number")}
              placeholder={t("serial_number")}
              value={formData.serialNumber}
              onChange={handleChange}
              required
            />
            <div className="md:col-span-2">
              <InputField
                fieldSize="lg"
                name="productKey"
                label={t("product_key")}
                placeholder={t("product_key")}
                value={formData.productKey}
                onChange={handleChange}
                required
              />
            </div>
          </div>
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
            {t("activate")}
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}

export default NewActivationForm;
