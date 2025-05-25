// src/pages/NewActivationForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';

interface NewActivationFormData {
  institution_name: string;
  head_of_institution: string;
  email: string;
  mobile_no: string;
  password: string;
  product_key: string;
}

function NewActivationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NewActivationFormData>({
    institution_name: '',
    head_of_institution: '',
    email: '',
    mobile_no: '',
    password: '',
    product_key: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRePassword, setShowRePassword] = useState<boolean>(false);
  const [rePassword, setRePassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRePassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== rePassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await invoke('perform_new_activation', { details: formData });
      setSuccess('Activation successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error("New activation failed:", err);
      setError(err.toString());
    }
  };

  return (
    <div className="container mx-auto mt-8 text-center">
      <div className="p-4 bg-white rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-2">
          Active
        </h1>
        <h2 className="text-xl font-semibold mb-4">
          Activation
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="institution_name" className="sr-only">Institution Name</label>
              <input
                id="institution_name"
                name="institution_name"
                type="text"
                placeholder="Institution Name"
                value={formData.institution_name}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="head_of_institution" className="sr-only">Head of Institution</label>
              <input
                id="head_of_institution"
                name="head_of_institution"
                type="text"
                placeholder="Head of Institution"
                value={formData.head_of_institution}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="mobile_no" className="sr-only">Mobile No</label>
              <input
                id="mobile_no"
                name="mobile_no"
                type="tel"
                placeholder="Mobile No"
                value={formData.mobile_no}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0112 3.75c4.286 0 8.293 1.116 11.029 3.713l-.916 1.032M12 3.75v4.125m0 0c-4.121 0-7.721 1.448-10.329 3.607l-.916 1.032c-.781.781-1.559 1.559-2.338 2.338Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5Z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )}
              </button>
            </div>
            <div className="relative">
              <label htmlFor="re_password" className="sr-only">Re enter Password</label>
              <input
                id="re_password"
                name="re_password"
                type={showRePassword ? 'text' : 'password'}
                placeholder="Re enter Password"
                value={rePassword}
                onChange={handleRePasswordChange}
                required
                className="border border-gray-300 p-2 rounded w-full pr-10"
              />
               <button
                type="button"
                onClick={() => setShowRePassword(!showRePassword)}
                className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
              >
                {showRePassword ? (
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0112 3.75c4.286 0 8.293 1.116 11.029 3.713l-.916 1.032M12 3.75v4.125m0 0c-4.121 0-7.721 1.448-10.329 3.607l-.916 1.032c-.781.781-1.559 1.559-2.338 2.338Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5Z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )}
              </button>
            </div>
            <div>
              <label htmlFor="product_key" className="sr-only">Product Key</label>
              <input
                id="product_key"
                name="product_key"
                type="text"
                placeholder="Product Key"
                value={formData.product_key}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full"
              >
                Activate
              </button>
            </div>
          </div>
        </form>
        {(!!error || !!success) && (
          <div className={`mt-4 p-3 rounded text-white ${error ? 'bg-red-500' : 'bg-green-500'}`}>
            {error || success}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewActivationForm; 