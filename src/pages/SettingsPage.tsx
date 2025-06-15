import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

const SettingsPage = () => {
  const { language, setLanguage, t } = useLanguage();
  const { userRole } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value as 'en' | 'kn' | 'hi');
  };

  const handleSave = () => {
    setLanguage(selectedLanguage);
    alert('Settings saved!');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {userRole === "admin" && <AdminSidebar />}
      <div className="flex flex-col flex-1 items-center justify-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">{t('settings')}</h2>
          <div className="mb-4">
            <label htmlFor="language-select" className="block text-gray-700 text-sm font-bold mb-2">
              {t('select_language')}:
            </label>
            <select
              id="language-select"
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="en">{t('english')}</option>
              <option value="kn">{t('kannada')}</option>
              <option value="hi">{t('hindi')}</option>
            </select>
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 