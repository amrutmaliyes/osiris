import React from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect } from 'react';
import { getSubjectImage, getGenericFolderImage, getFileImage, getClassImage } from '../utils/contentImages';
import { FileEntry } from '../types';
import FileBrowserView from './FileBrowserView';

interface ContentBrowserProps {
    currentPath: string;
    onNavigate: (newPath: string) => void;
    onOpenFile: (filePath: string) => void;
    initialActivePath: string | null;
}

const ContentBrowser: React.FC<ContentBrowserProps> = ({ currentPath, onNavigate, onOpenFile, initialActivePath }) => {
    const [entries, setEntries] = useState<FileEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasFiles, setHasFiles] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<string>('Videos');

    useEffect(() => {
        const fetchEntries = async () => {
            setLoading(true);
            setError(null);
            try {
                const allItems = await invoke('list_directories_in_path', { path: currentPath }) as FileEntry[];
                setHasFiles(allItems.some(entry => !entry.isDirectory));

                let filteredItems: FileEntry[] = [];

                if (allItems.some(entry => !entry.isDirectory)) {
                    switch (selectedTab) {
                        case 'Videos':
                            filteredItems = allItems.filter(entry =>
                                !entry.isDirectory &&
                                entry.name.toLowerCase().endsWith('.mp4') &&
                                !entry.name.toLowerCase().includes('animation')
                            );
                            break;
                        case 'Animations':
                            filteredItems = allItems.filter(entry =>
                                !entry.isDirectory &&
                                entry.name.toLowerCase().endsWith('.mp4') &&
                                entry.name.toLowerCase().includes('animation')
                            ).map(entry => ({
                                ...entry,
                                name: entry.name.toLowerCase().replace(/\s?animation\s?/gi, '').trim(),
                            }));
                            break;
                        case 'Notes':
                            filteredItems = allItems.filter(entry => !entry.isDirectory && entry.name.toLowerCase().endsWith('.pdf') && !entry.name.toLowerCase().includes('textbook'));
                            break;
                        case 'Textbooks':
                            filteredItems = allItems.filter(entry =>
                                !entry.isDirectory &&
                                entry.name.toLowerCase().endsWith('.pdf') &&
                                entry.name.toLowerCase().includes('textbook')
                            ).map(entry => ({
                                ...entry,
                                name: entry.name.toLowerCase().replace(/\s?textbook\s?/gi, '').trim(),
                            }));
                            break;
                        case 'Quiz':
                            filteredItems = allItems.filter(entry => !entry.isDirectory && entry.name.toLowerCase().endsWith('.xml'));
                            break;
                        case 'Activities':
                            filteredItems = allItems.filter(entry =>
                                !entry.isDirectory &&
                                entry.name.toLowerCase().includes('activity')
                            ).map(entry => ({
                                ...entry,
                                name: entry.name.toLowerCase().replace(/\s?activity\s?/gi, '').trim(),
                            }));
                            break;
                        case 'Assessments':
                            filteredItems = allItems.filter(entry => !entry.isDirectory && entry.name.toLowerCase().includes('assessment'));
                            break;
                        default:
                            filteredItems = allItems.filter(entry => !entry.isDirectory);
                            break;
                    }
                } else {
                    filteredItems = allItems;
                }
                setEntries(filteredItems);
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
    }, [currentPath, selectedTab]);

    const handleItemClick = (entry: FileEntry) => {
        const itemPath = `${currentPath}/${entry.name}`.replace(/\/+/g, '/');

        if (entry.isDirectory) {
            onNavigate(itemPath);
        } else {
            onOpenFile(itemPath);
        }
    };

    const getImage = (entry: FileEntry) => {
        if (!initialActivePath) return getGenericFolderImage();

        const activePathSegments = initialActivePath.split('/').filter(segment => segment !== '');
        const currentPathSegments = currentPath.split('/').filter(segment => segment !== '');

        let divergenceIndex = 0;
        while (divergenceIndex < currentPathSegments.length && divergenceIndex < activePathSegments.length && currentPathSegments[divergenceIndex] === activePathSegments[divergenceIndex]) {
            divergenceIndex++;
        }

        const relativeLevel = currentPathSegments.length - divergenceIndex;

        if (!entry.isDirectory) {
             return getFileImage(entry.name);
        }

        if (relativeLevel === 0) {
            return getClassImage(entry.name) || getGenericFolderImage();
        } else if (relativeLevel === 1) {
            return getSubjectImage(entry.name);
        } else {
            return getGenericFolderImage();
        }
    };

    if (loading) {
        return <p className="text-lg">Loading content...</p>;
    }

    if (error) {
        return <div className="text-red-700 text-lg">{error}</div>;
    }

    return (
        <div className="flex flex-col">
            {hasFiles ? (
                <FileBrowserView
                    entries={entries}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    onOpenFile={onOpenFile}
                    currentPath={currentPath}
                />
            ) : entries.length === 0 ? (
                <p className="text-gray-600 text-lg">No content found in this directory.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {entries.map(entry => (
                        <div
                            key={entry.name}
                            className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100 transition duration-150 ease-in-out"
                            onClick={() => handleItemClick(entry)}
                        >
                            <img src={getImage(entry)} alt={entry.name} className="w-36 h-36 object-cover rounded-md" />
                            <p className="mt-2 text-lg font-medium text-gray-700 text-center break-all">{entry.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContentBrowser; 