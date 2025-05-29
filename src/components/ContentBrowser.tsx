import React from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect } from 'react';
import { getSubjectImage, getGenericFolderImage, getFileImage, getClassImage } from '../utils/contentImages'; // Import image utilities

interface FileEntry {
    name: string;
    isDirectory: boolean;
}

interface ContentBrowserProps {
    currentPath: string;
    onNavigate: (newPath: string) => void;
    onOpenFile: (filePath: string) => void;
    initialActivePath: string | null; // Add initialActivePath to props
}

const ContentBrowser: React.FC<ContentBrowserProps> = ({ currentPath, onNavigate, onOpenFile, initialActivePath }) => {
    const [entries, setEntries] = useState<FileEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEntries = async () => {
            setLoading(true);
            setError(null);
            try {
                const items = await invoke('list_directories_in_path', { path: currentPath }) as FileEntry[];
                setEntries(items);
            } catch (err: any) {
                console.error("Error listing entries:", err);
                setError(`Failed to load content: ${err}`);
            } finally {
                setLoading(false);
            }
        };

        if (currentPath) {
            fetchEntries();
        }
    }, [currentPath]);

    const handleItemClick = (entry: FileEntry) => {
        const itemPath = `${currentPath}/${entry.name}`.replace(/\/+/g, '/'); // Construct full path and normalize slashes

        if (entry.isDirectory) {
            onNavigate(itemPath); // Navigate deeper if it's a directory
        } else {
            onOpenFile(itemPath); // Open file if it's a file
        }
    };

    // Determine image based on current level/path and item name
    const getImage = (entry: FileEntry) => {
        if (!initialActivePath) return getGenericFolderImage(); // Fallback if active path is not set

        // Calculate level relative to the initial active path
        const activePathSegments = initialActivePath.split('/').filter(segment => segment !== '');
        const currentPathSegments = currentPath.split('/').filter(segment => segment !== '');

        // Find the index where the current path diverges from the active path
        let divergenceIndex = 0;
        while (divergenceIndex < currentPathSegments.length && divergenceIndex < activePathSegments.length && currentPathSegments[divergenceIndex] === activePathSegments[divergenceIndex]) {
            divergenceIndex++;
        }

        // The level relative to the active path is the number of segments after the divergence point
        const relativeLevel = currentPathSegments.length - divergenceIndex;

        if (!entry.isDirectory) {
             return getFileImage(entry.name);
        }

        // Determine image for directories based on relative level
        if (relativeLevel === 0) { // Level 1 within the content browser (Classes)
            return getClassImage(entry.name) || getGenericFolderImage();
        } else if (relativeLevel === 1) { // Level 2 within the content browser (Subjects)
            return getSubjectImage(entry.name);
        } else { // Chapters or deeper, use generic folder image
            return getGenericFolderImage();
        }
    };

    if (loading) {
        return <p>Loading content...</p>;
    }

    if (error) {
        return <div className="text-red-700">{error}</div>;
    }

    if (entries.length === 0) {
        return <p className="text-gray-600">No content found in this directory.</p>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {entries.map(entry => (
                <div
                    key={entry.name} // Use entry name as key
                    className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100 transition duration-150 ease-in-out"
                    onClick={() => handleItemClick(entry)}
                >
                    {entry.isDirectory ? (
                         <img src={getImage(entry)} alt={entry.name} className="w-12 h-12 object-cover rounded-md" />
                    ) : (
                         <img src={getImage(entry)} alt={entry.name} className="w-12 h-12 object-cover rounded-md" />
                    )}
                    <p className="mt-2 text-sm font-medium text-gray-700 text-center break-all">{entry.name}</p>
                </div>
            ))}
        </div>
    );
};

export default ContentBrowser; 