import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { invoke } from "@tauri-apps/api/core";
import { useAuth } from "../contexts/AuthContext";

function HomePage() {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [hasContentPath, setHasContentPath] = useState<boolean>(false);
  const [loadingContentPath, setLoadingContentPath] = useState<boolean>(true);

  const handleLogoutClick = () => {
    navigate("/login");
  };

  const handleAddContentPathClick = () => {
    navigate("/content");
  };

  useEffect(() => {
    const checkContentPath = async () => {
      try {
        const hasPath = (await invoke("has_active_content_path")) as boolean;
        setHasContentPath(hasPath);
      } catch (error) {
        console.error("Error checking content path:", error);
      } finally {
        setLoadingContentPath(false);
      }
    };

    if (userRole === "admin") {
      checkContentPath();
    }
  }, [userRole]);

  if (userRole === "admin" && loadingContentPath) {
    return <div>Loading content path status...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {userRole === "admin" && (
        <>
          <AdminSidebar />
          {!hasContentPath && (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <h1 className="text-2xl font-bold mb-4 text-center">
                Please set the content path
              </h1>
              <p className="text-lg mb-6 text-center">
                A content path is required to access and manage educational
                materials.
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleAddContentPathClick}
              >
                Add Content Path
              </button>
            </div>
          )}
          {hasContentPath && (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <h1 className="text-3xl font-bold mb-4">
                Welcome to the Home Page!
              </h1>
              <p className="text-lg mb-4">Content goes here...</p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleLogoutClick}
              >
                Logout
              </button>
            </div>
          )}
        </>
      )}
      {userRole !== "admin" && (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page!</h1>
          <p className="text-lg mb-4">Content goes here...</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
