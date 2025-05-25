import { Link } from 'react-router-dom';

function ActivationPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-sm">
        {/* Replace with your logo or app title */}
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-2">
          Active
        </h1>
        <h2 className="text-center text-xl font-semibold text-gray-700 mb-6">
          Product Activation Panel
        </h2>
        <div className="flex flex-col space-y-4 mt-4">
          <div>
            <Link
              to="/reactivation"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md text-lg w-full text-center"
            >
              Have Activation Key
            </Link>
          </div>
          <div>
            <Link
              to="/new-activation"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md text-lg w-full text-center"
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