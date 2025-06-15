import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import logo from "../assets/logo.svg";
import logoutIcon from "../assets/logout.svg";

function AppHeader() {
  const { user, userRole, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  console.log("userRole", userRole);
  console.log("user", user);
  console.log("location", location);
  // Render nothing if user is not logged in or on activation/login pages
  if (!user || userRole === null || userRole === "admin" || location.pathname === "/activation" || location.pathname === "/login" || location.pathname === "/new-activation" || location.pathname === "/reactivation") {
    console.log("Here")
    return null;
  }

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
    <img src={logo} alt="Osiris Logo" className="h-10" />
    <div className="flex items-center space-x-4">
        {user && (
          <span className="text-gray-700 text-sm font-medium">
            {t('welcome')}, {user.name}
          </span>
        )}
        <Link to="/settings" className="text-blue-500 hover:text-blue-600 font-bold py-1 px-3 rounded text-sm cursor-pointer">
          {t('settings')}
        </Link>
        {userRole === 'User' && (
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-500 hover:text-red-600 font-bold py-1 px-3 rounded text-sm cursor-pointer"
          >
            <img src={logoutIcon} alt="Logout" className="h-4 w-4" />
            <span>{t('logout')}</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default AppHeader; 