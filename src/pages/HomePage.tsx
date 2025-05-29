import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { invoke } from "@tauri-apps/api/core";
import { useAuth } from "../contexts/AuthContext";
import ContentBrowser from "../components/ContentBrowser";

function HomePage() {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [hasActiveContentPath, setHasActiveContentPath] = useState<boolean>(false);
  const [loadingContentPath, setLoadingContentPath] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string | null>(null);

  const handleAddContentPathClick = () => {
    navigate("/content");
  };

  const handleNavigate = (newPath: string) => {
    setCurrentPath(newPath);
  };

  const handleBack = () => {
    if (currentPath && initialActivePath) {
      // Ensure we don't navigate above the initial active path
      if (currentPath === initialActivePath) {
        // Already at the root of the active path, do nothing or handle as needed
        return;
      }

      const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));

      // If the parent path is the same as the initial active path or deeper within it,
      // set the current path to the parent path.
      if (initialActivePath.startsWith(parentPath) || parentPath.startsWith(initialActivePath)) {
           setCurrentPath(parentPath || initialActivePath); // Go back or to active root if parent is empty
      } else {
           // This case should ideally not be reached with correct navigation, 
           // but as a fallback, navigate to the initial active path.
           setCurrentPath(initialActivePath);
      }
    }
  };

  const handleOpenFile = async (filePath: string) => {
    console.log("Attempting to open file:", filePath);
    try {
        await invoke('open_file_in_system', { path: filePath });
    } catch (error) {
        console.error("Error opening file:", error);
        // Optionally show an error message to the user
    }
  };

  const [initialActivePath, setInitialActivePath] = useState<string | null>(null);

  useEffect(() => {
    const checkContentPath = async () => {
      try {
        const hasPath = (await invoke("has_active_content_path")) as boolean;
        setHasActiveContentPath(hasPath);

        if (hasPath) {
          const activePath = await invoke("get_active_content_path") as string | null;
          setInitialActivePath(activePath); // Store initial active path
          setCurrentPath(activePath); // Set initial current path for browsing
        } else {
          setInitialActivePath(null);
          setCurrentPath(null);
        }

      } catch (error) {
        console.error("Error checking content path:", error);
      } finally {
        setLoadingContentPath(false);
      }
    };

    checkContentPath();

  }, []);

  if (userRole === "admin" && loadingContentPath) {
    return <div>Loading content path status...</div>;
  }

  const isAtContentRoot = currentPath === initialActivePath && hasActiveContentPath;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {userRole === "admin" && <AdminSidebar />}

      <div className={`flex-1 p-4 ${userRole === "admin" ? '' : 'ml-0'}`}>
        {hasActiveContentPath ? (
          <div className="flex-1 p-4">
            <h1 className="text-3xl font-bold mb-4">Content Area</h1>

            {!isAtContentRoot && currentPath !== null && (
              <button
                className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
                onClick={handleBack}
              >
                Back
              </button>
            )}

            {currentPath && initialActivePath && (
              <ContentBrowser
                currentPath={currentPath}
                onNavigate={handleNavigate}
                onOpenFile={handleOpenFile}
                initialActivePath={initialActivePath} // Pass initialActivePath
              />
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
