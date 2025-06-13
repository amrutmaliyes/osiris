import React from 'react';
import { FileEntry } from '../types';

interface FileBrowserViewProps {
    entries: FileEntry[];
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
    onOpenFile: (filePath: string) => void;
    currentPath: string;
}

const tabs = [
    { name: 'Videos', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-5 4v-4m0 0l-5-5m5 5l5-5" /></svg> },
    { name: 'Animations', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { name: 'Notes', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
    { name: 'Textbooks', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" /></svg> },
    { name: 'Quiz', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9.247a1 1 0 01.791-.075 2 2 0 001.542 0 1 1 0 01.79-.075L21 9m-11 5l-3 3m5-3l3 3m2-14l3.5 3.5M19 7l3.5 3.5M15 4a3 3 0 11-6 0 3 3 0 016 0zm6 14a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 002 2h2a2 2 0 012 2v2a2 2 0 01-2 2z" /></svg> },
    { name: 'Activities', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.343l-.707-.707m12.728 0l-.707.707M12 21v-1m-4.636-1.636l-.707.707M3 12h1m-.707 5.364l.707-.707M17 12H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v3a2 2 0 01-2 2z" /></svg> },
    { name: 'Assessments', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
];

const getFileIcon = (fileName: string) => {
    const lowerCaseFileName = fileName.toLowerCase();
    if (lowerCaseFileName.endsWith('.mp4')) {
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-5 4v-4m0 0l-5-5m5 5l5-5" /></svg>;
    } else if (lowerCaseFileName.endsWith('.pdf')) {
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    } else if (lowerCaseFileName.endsWith('.xml')) {
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m-9 11h10a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    } else {
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
    }
};

const FileBrowserView: React.FC<FileBrowserViewProps> = ({ entries, selectedTab, setSelectedTab, onOpenFile, currentPath }) => {
    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-7 gap-4 bg-white p-4 rounded-lg shadow mb-4">
                {tabs.map(tab => (
                    <div
                        key={tab.name}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition duration-150 ease-in-out
                            ${selectedTab === tab.name ? 'bg-orange-100 text-orange-800 shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                        onClick={() => setSelectedTab(tab.name)}
                    >
                        {tab.icon}
                        <span className="text-lg font-semibold mt-1">{tab.name}</span>
                    </div>
                ))}
            </div>

            {entries.length === 0 ? (
                <p className="text-gray-600 text-xl text-center mt-8 font-bold">No {selectedTab.toLowerCase()} found here.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 p-4">
                    {entries.map(entry => (
                        <div
                            key={entry.name}
                            className="flex items-center p-5 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-102 transition duration-200 ease-in-out border border-gray-200"
                            onClick={() => onOpenFile(`${currentPath}/${entry.originalName || entry.name}`.replace(/\/+/g, '/'))}
                        >
                            <span className="flex-shrink-0 text-gray-600 mr-4">
                                {getFileIcon(entry.name)}
                            </span>
                            <p className="flex-grow text-xl font-semibold text-gray-800 break-all">{
                                (() => {
                                    let displayName = entry.name;
                                    const extensionsToRemove = ['.mp4', '.pdf', '.xml'];
                                    for (const ext of extensionsToRemove) {
                                        if (displayName.toLowerCase().endsWith(ext)) {
                                            displayName = displayName.slice(0, -ext.length);
                                            break;
                                        }
                                    }
                                    return displayName.toUpperCase();
                                })()
                            }</p>
                            {(selectedTab === 'Videos' || selectedTab === 'Animations') && entry.name.toLowerCase().endsWith('.mp4') && (
                                <button
                                    className="ml-auto bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg text-base shadow"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onOpenFile(`${currentPath}/${entry.originalName || entry.name}`.replace(/\/+/g, '/'));
                                    }}
                                >
                                    Play
                                </button>
                            )}
                            {(!(selectedTab === 'Videos' || selectedTab === 'Animations') || !entry.name.toLowerCase().endsWith('.mp4')) && (
                                <button
                                    className="ml-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg text-base shadow"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onOpenFile(`${currentPath}/${entry.originalName || entry.name}`.replace(/\/+/g, '/'));
                                    }}
                                >
                                    Open
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileBrowserView; 