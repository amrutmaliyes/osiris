import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import logo from '../assets/logo.svg';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../contexts/AuthContext';

interface ContentPath {
  id: number;
  path: string;
  is_active: boolean;
}

function ContentPathPage() {
  const { userRole } = useAuth();
  const [contentPaths, setContentPaths] = useState<ContentPath[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [newPath, setNewPath] = useState<string>('');

  useEffect(() => {
    const fetchContentPaths = async () => {
      try {
        const paths = await invoke('get_content_paths') as ContentPath[];
        setContentPaths(paths);
      } catch (err: any) {
        console.error("Failed to fetch content paths:", err);
        setError("Failed to load content paths.");
      } finally {
        setLoading(false);
      }
    };

    if (userRole === 'admin') {
      fetchContentPaths();
    } else {
      setLoading(false);
      setError("Access Denied: Only administrators can view this page.");
    }
  }, [userRole]);

  const handleBrowseClick = async () => {
    setError(null);
    setMessage(null);
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select Content Folder',
      });

      if (selected && typeof selected === 'string') {
        setNewPath(selected);
      } else {
        console.log("Directory selection cancelled.");
      }
    } catch (err: any) {
      console.error("Failed to select content path:", err);
      setError(`Error selecting content path: ${err}`);
    }
  };

  const handleAddPath = async () => {
    setError(null);
    setMessage(null);
    if (!newPath) {
      setError("Please select a directory first.");
      return;
    }
    try {
      await invoke('add_and_set_active_content_path', { path: newPath });
      setMessage("Content path saved and set as active successfully!");
      const updatedPaths = await invoke('get_content_paths') as ContentPath[];
      setContentPaths(updatedPaths);
      setNewPath('');
    } catch (err: any) {
      console.error("Failed to save content path:", err);
      setError(`Error saving content path: ${err}`);
    }
  };

  const handleSetActive = async (id: number) => {
    setError(null);
    setMessage(null);
    try {
      await invoke('set_active_content_path', { id });
      setMessage(`Content path with ID ${id} set as active!`);
      const updatedPaths = await invoke('get_content_paths') as ContentPath[];
      setContentPaths(updatedPaths);
    } catch (err: any) {
      console.error("Failed to set active content path:", err);
      setError(`Error setting content path active: ${err}`);
    }
  };

  const handleDeletePath = async (id: number) => {
    setError(null);
    setMessage(null);
    if (window.confirm('Are you sure you want to delete this content path?')) {
      try {
        await invoke('delete_content_path', { id });
        setMessage(`Content path with ID ${id} deleted successfully.`);
        const updatedPaths = await invoke('get_content_paths') as ContentPath[];
        setContentPaths(updatedPaths);
      } catch (err: any) {
        console.error("Failed to delete content path:", err);
        setError(`Error deleting content path: ${err}`);
      }
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-6 bg-white rounded-lg shadow-xl text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Access Denied</h1>
          <p className="text-gray-700">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Content Paths</h1>

        {loading ? (
          <p>Loading content paths...</p>
        ) : error ? (
          <div className="p-4 rounded-md bg-red-100 text-red-700">{error}</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
              <img src={logo} alt="Osiris Logo" className="h-12 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4 text-center">Add New Content Path</h2>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  className="flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newPath}
                  readOnly
                  placeholder="No directory selected"
                />
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out"
                  onClick={handleBrowseClick}
                >
                  Browse
                </button>
                <button
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out"
                  onClick={handleAddPath}
                  disabled={!newPath}
                >
                  Add Path
                </button>
              </div>
              {message && (
                <div className="mt-4 p-3 rounded-md bg-green-100 text-green-700">
                  {message}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Existing Content Paths</h2>
              {contentPaths.length > 0 ? (
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Path
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentPaths.map((path) => (
                      <tr key={path.id}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">{path.id}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap break-all">{path.path}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <span
                            className={`relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight ${path.is_active ? '' : 'opacity-50'}`}
                          >
                            <span
                              aria-hidden="true"
                              className={`absolute inset-0 opacity-50 rounded-full ${path.is_active ? 'bg-green-200' : 'bg-red-200'}`}
                            ></span>
                            <span className="relative">{path.is_active ? 'Active' : 'Inactive'}</span>
                          </span>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {!path.is_active && (
                            <>
                              <button
                                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-3 rounded text-xs transition duration-150 ease-in-out"
                                onClick={() => handleSetActive(path.id)}
                              >
                                Set Active
                              </button>
                              <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs ml-2 transition duration-150 ease-in-out"
                                onClick={() => handleDeletePath(path.id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600">No content paths found.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ContentPathPage; 