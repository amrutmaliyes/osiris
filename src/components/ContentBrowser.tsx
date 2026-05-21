import React from "react";
import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect } from "react";
import {
  getSubjectImage,
  getGenericFolderImage,
  getFileImage,
  getClassImage,
} from "../utils/contentImages";
import { FileEntry } from "../types";
import FileBrowserView from "./FileBrowserView";

interface ContentBrowserProps {
  currentPath: string;
  onNavigate: (newPath: string) => void;
  onOpenFile: (filePath: string) => void;
  initialActivePath: string | null;
}

const ContentBrowser: React.FC<ContentBrowserProps> = ({
  currentPath,
  onNavigate,
  onOpenFile,
  initialActivePath,
}) => {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFiles, setHasFiles] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Videos");

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      setError(null);
      try {
        const allItems = (await invoke("list_directories_in_path", {
          path: currentPath,
        })) as FileEntry[];
        setHasFiles(allItems.some((entry) => !entry.isDirectory));

        let filteredItems: FileEntry[] = [];

        if (allItems.some((entry) => !entry.isDirectory)) {
          const contentFiles = allItems.filter((entry) => !entry.isDirectory);

          const allNotes = contentFiles.filter((file) =>
            file.name.toLowerCase().endsWith(".pdf")
          );
          const textbookNotes = allNotes.filter((file) =>
            file.name.toLowerCase().includes("textbook")
          );
          const assessmentNotes = allNotes.filter((file) =>
            file.name.toLowerCase().includes("assessment")
          );
          const activityNotes = allNotes.filter((file) =>
            file.name.toLowerCase().includes("activities")
          );

          const textbooks = textbookNotes.map((file) => ({
            ...file,
            originalName: file.name,
            name: file.name
              .toLowerCase()
              .replace(/\s?textbook\s?/gi, "")
              .trim(),
          }));

          const assessments = assessmentNotes.map((file) => ({
            ...file,
            originalName: file.name,
            name: file.name
              .toLowerCase()
              .replace(/\s?assessment\s?/gi, "")
              .trim(),
          }));

          const activities = activityNotes.map((file) => ({
            ...file,
            originalName: file.name,
            name: file.name
              .toLowerCase()
              .replace(/\s?activities\s?/gi, "")
              .trim(),
          }));

          const notes = allNotes
            .filter(
              (file) =>
                !file.name.toLowerCase().includes("textbook") &&
                !file.name.toLowerCase().includes("assessment") &&
                !file.name.toLowerCase().includes("activities")
            )
            .map((file) => ({ ...file, originalName: file.name }));

          const videoExtensions = ["mp4", "mov", "webm", "m4v"];
          const allVideos = contentFiles.filter((file) =>
            videoExtensions.includes(file.name.split(".").pop()!.toLowerCase())
          );

          const animatedVideos = allVideos.filter((file) =>
            file.name.toLowerCase().includes("animated")
          );
          const animations = animatedVideos.map((file) => ({
            ...file,
            originalName: file.name,
            name: file.name
              .toLowerCase()
              .replace(/\s?animated\s?/gi, "")
              .trim(),
          }));

          const videos = allVideos.filter(
            (file) => !file.name.toLowerCase().includes("animated")
          );
          const quiz = contentFiles.filter((file) =>
            file.name.toLowerCase().endsWith(".xml")
          );

          const contentMap: { [key: string]: FileEntry[] } = {
            Videos: videos,
            Animations: animations,
            Notes: notes,
            Textbooks: textbooks,
            Quiz: quiz,
            Activities: activities,
            Assessments: assessments,
            default: contentFiles,
          };

          filteredItems = contentMap[selectedTab] || contentMap["default"];
        } else {
          filteredItems = allItems.sort((a, b) => {
            const nameA = a.name.toLowerCase().replace(/\s/g, "");
            const nameB = b.name.toLowerCase().replace(/\s/g, "");

            if (nameA === "prenursery") return -1;
            if (nameB === "prenursery") return 1;

            const numA = parseInt(nameA.replace("class", ""), 10);
            const numB = parseInt(nameB.replace("class", ""), 10);

            return numA - numB;
          });
        }
        setEntries(filteredItems);
      } catch (err: unknown) {
        setError(`Failed to load content: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    if (currentPath) fetchEntries();
  }, [currentPath, selectedTab]);

  const handleItemClick = (entry: FileEntry) => {
    const itemPath = `${currentPath}/${entry.originalName || entry.name}`.replace(
      /\/+/g,
      "/"
    );

    if (entry.isDirectory) {
      onNavigate(itemPath);
    } else {
      onOpenFile(itemPath);
    }
  };

  const getImage = (entry: FileEntry) => {
    if (!initialActivePath) return getGenericFolderImage();

    const activePathSegments = initialActivePath
      .split("/")
      .filter((segment) => segment !== "");
    const currentPathSegments = currentPath
      .split("/")
      .filter((segment) => segment !== "");

    let divergenceIndex = 0;
    while (
      divergenceIndex < currentPathSegments.length &&
      divergenceIndex < activePathSegments.length &&
      currentPathSegments[divergenceIndex] ===
        activePathSegments[divergenceIndex]
    ) {
      divergenceIndex++;
    }

    const relativeLevel = currentPathSegments.length - divergenceIndex;

    if (!entry.isDirectory) return getFileImage(entry.name);
    if (relativeLevel === 0)
      return getClassImage(entry.name) || getGenericFolderImage();
    if (relativeLevel <= 2) return getSubjectImage(entry.name);
    return getGenericFolderImage();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-[var(--color-error)]/10 p-4 text-[var(--color-error)]">
        {error}
      </div>
    );
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
        <p className="py-8 text-center text-[var(--color-text-secondary)]">
          No content found in this directory.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {entries.map((entry) => (
            <button
              key={entry.name}
              type="button"
              onClick={() => handleItemClick(entry)}
              className="flex flex-col items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-md)] transition hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-lg)]"
            >
              <img
                src={getImage(entry)}
                alt={entry.name}
                className="mb-3 h-28 w-full rounded-xl object-cover"
              />
              <p className="text-center text-sm font-semibold text-[var(--color-text)]">
                {entry.name}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentBrowser;
