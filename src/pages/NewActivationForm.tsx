// src/pages/NewActivationForm.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import logo from "../assets/logo.svg";
import { useLanguage } from "../contexts/LanguageContext";

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
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const result = await invoke("perform_new_activation", { formData });

      if (result) {
        setSuccess(t('application_activated_success'));
        console.log("Activation successful:", result);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(t('activation_failed'));
        console.error("Activation failed:", result);
      }
    } catch (err: any) {
      console.error("New activation failed:", err);
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
            &larr; {t('back_button')}
          </Link>
        </div>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Osiris Logo" className="h-20" />
        </div>
        <h2 className="text-xl font-semibold mb-4">{t('activation_title')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="institutionName" className="sr-only">
                {t('institution_name')}
              </label>
              <input
                id="institutionName"
                name="institutionName"
                type="text"
                placeholder={t('institution_name')}
                value={formData.institutionName}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="headOfInstitution" className="sr-only">
                {t('head_of_institution')}
              </label>
              <input
                id="headOfInstitution"
                name="headOfInstitution"
                type="text"
                placeholder={t('head_of_institution')}
                value={formData.headOfInstitution}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="mobileNo" className="sr-only">
                {t('mobile_no')}
              </label>
              <input
                id="mobileNo"
                name="mobileNo"
                type="tel"
                placeholder={t('mobile_no')}
                value={formData.mobileNo}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="serialNumber" className="sr-only">
                {t('serial_number')}
              </label>
              <input
                id="serialNumber"
                name="serialNumber"
                type="text"
                placeholder={t('serial_number')}
                value={formData.serialNumber}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="productKey" className="sr-only">
                {t('product_key')}
              </label>
              <input
                id="productKey"
                name="productKey"
                type="text"
                placeholder={t('product_key')}
                value={formData.productKey}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                {t('activate')}
              </button>
            </div>
          </div>
        </form>
        {(!!error || !!success) && (
          <div
            className={`mt-4 p-3 rounded text-white ${
              error ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {error || success}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewActivationForm;
