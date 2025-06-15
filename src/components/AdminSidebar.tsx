import logo from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

function AdminSidebar() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogoutClick = () => {
    navigate("/login");
  };

  return (
    <div className="w-64 bg-gray-900 text-gray-200 flex flex-col shadow-lg">
      <div className="flex items-center justify-center h-20 border-b border-gray-700 p-4">
        <img src={logo} alt="Osiris Logo" className="h-10" />
      </div>
      <nav className="mt-6 flex-1 px-4 space-y-2">
        <Link
          to="/home"
          className="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-700 hover:text-white transition duration-150 ease-in-out"
        >
          <svg
            className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          {t('home_page')}
        </Link>
        <Link
          to="/content"
          className="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-700 hover:text-white transition duration-150 ease-in-out"
        >
          <svg
            className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v14m2 0l2.5-.5a2 2 0 002-2V7a2 2 0 00-2-2h-3m-6 14l-2-2m2 2l-2-2m7-10v4m3-4v4"
            />
          </svg>
          {t('content')}
        </Link>
        <Link
          to="/users"
          className="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-700 hover:text-white transition duration-150 ease-in-out"
        >
          <svg
            className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          {t('users')}
        </Link>
        <Link
          to="/settings"
          className="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-700 hover:text-white transition duration-150 ease-in-out"
        >
          <svg
            className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {t('settings')}
        </Link>
      </nav>
      <div className="mt-auto px-4 py-4 border-t border-gray-700">
        <button
          onClick={handleLogoutClick}
          className="group flex items-center w-full px-2 py-2 text-base font-medium rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition duration-150 ease-in-out"
        >
          <svg
            className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-10a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {t('logout')}
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
