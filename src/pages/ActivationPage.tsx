import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

function ActivationPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="p-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Osiris Logo" className="h-20" />
        </div>
        <h2 className="text-center text-xl font-semibold text-gray-600 dark:text-gray-300 mb-8">
          Product Activation Panel
        </h2>
        <div className="flex flex-col space-y-5">
          <div>
            <Link
              to="/reactivation"
              className="inline-block bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg text-lg w-full text-center transition duration-300 ease-in-out transform hover:scale-105"
            >
              Have Activation Key
            </Link>
          </div>
          <div>
            <Link
              to="/new-activation"
              className="inline-block bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg text-lg w-full text-center transition duration-300 ease-in-out transform hover:scale-105"
            >
              Register for Activation Key
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivationPage; 