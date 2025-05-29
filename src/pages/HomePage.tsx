import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { invoke } from "@tauri-apps/api/core";
import { useAuth } from "../contexts/AuthContext";

function HomePage() {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [hasActiveContentPath, setHasActiveContentPath] = useState<boolean>(false);
  const [loadingContentPath, setLoadingContentPath] = useState<boolean>(true);
  const [directories, setDirectories] = useState<string[]>([]);
  const [loadingDirectories, setLoadingDirectories] = useState<boolean>(false);
  const [directoriesError, setDirectoriesError] = useState<string | null>(null);

  const handleAddContentPathClick = () => {
    navigate("/content");
  };

  useEffect(() => {
    const checkContentPath = async () => {
      try {
        const hasPath = (await invoke("has_active_content_path")) as boolean;
        setHasActiveContentPath(hasPath);
      } catch (error) {
        console.error("Error checking content path:", error);
      } finally {
        setLoadingContentPath(false);
      }
    };

    checkContentPath();

  }, []);

  useEffect(() => {
    const fetchDirectories = async () => {
        setLoadingDirectories(true);
        setDirectoriesError(null);
        try {
            const activePath = await invoke("get_active_content_path") as string | null;
            if (activePath) {
                const dirs = await invoke("list_directories_in_path", { path: activePath }) as string[];
                setDirectories(dirs);
            } else {
                setDirectories([]);
            }
        } catch (error: any) {
            console.error("Error listing directories:", error);
            setDirectoriesError(`Failed to load directories: ${error}`);
        } finally {
            setLoadingDirectories(false);
        }
    };

    if (hasActiveContentPath) {
        fetchDirectories();
    }
  }, [hasActiveContentPath]);

  if (userRole === "admin" && loadingContentPath) {
    return <div>Loading content path status...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Admin Sidebar only for admin */}
      {userRole === "admin" && <AdminSidebar />}

      {/* Main content area for all users */}
      <div className={`flex-1 p-4 ${userRole === "admin" ? '' : 'ml-0'}`}> {/* Adjust margin if not admin */}
        {hasActiveContentPath ? (
          <div className="flex-1 p-4">
              <h1 className="text-3xl font-bold mb-4">Content Area</h1>
              {loadingDirectories ? (
                  <p>Loading content...</p>
              ) : directoriesError ? (
                  <div className="text-red-700">{directoriesError}</div>
              ) : directories.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {directories.map(dir => (
                          <div key={dir} className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100 transition duration-150 ease-in-out">
                              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                              <p className="mt-2 text-sm font-medium text-gray-700 text-center break-all">{dir}</p>
                          </div>
                      ))}
                  </div>
              ) : (
                  <p className="text-gray-600">No directories found in the active content path.</p>
              )}
          </div>
        ) : (userRole === "admin" ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">
              No active content path set
            </h1>
            <p className="text-lg mb-6 text-center">
              Please set an active content path to access the content management features.
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleAddContentPathClick}
            >
              Go to Content Path Settings
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page!</h1>
            <p className="text-lg mb-4">No content is available at the moment. Please contact your administrator.</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
