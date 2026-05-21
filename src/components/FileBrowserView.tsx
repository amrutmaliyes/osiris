import React from "react";
import { FileEntry } from "../types";
import { categoryTabs } from "../constants/theme";
import Button from "./ui/Button";

interface FileBrowserViewProps {
  entries: FileEntry[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  onOpenFile: (filePath: string) => void;
  currentPath: string;
}

const getFileIcon = (fileName: string) => {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".mp4")) return "🎬";
  if (lower.endsWith(".pdf")) return "📄";
  if (lower.endsWith(".xml")) return "❓";
  return "📁";
};

const cleanDisplayName = (name: string) => {
  let displayName = name;
  for (const ext of [".mp4", ".pdf", ".xml"]) {
    if (displayName.toLowerCase().endsWith(ext)) {
      displayName = displayName.slice(0, -ext.length);
      break;
    }
  }
  return displayName
    .replace(/\./g, " ")
    .replace(/\s+/g, " ")
    .replace(/(animated|keypoints|assessment|textbook|activities)/gi, "")
    .trim();
};

const FileBrowserView: React.FC<FileBrowserViewProps> = ({
  entries,
  selectedTab,
  setSelectedTab,
  onOpenFile,
  currentPath,
}) => {
  const shouldHideActivities = ["socialstudies", "socialscience", "ಸಮಾಜವಿಜ್ಞಾನ"].some(
    (folder) => currentPath.toLowerCase().includes(folder.toLowerCase())
  );

  const tabs = shouldHideActivities
    ? categoryTabs.filter((tab) => tab.id !== "Activities")
    : categoryTabs;

  const openFile = (entry: FileEntry) => {
    onOpenFile(
      `${currentPath}/${entry.originalName || entry.name}`.replace(/\/+/g, "/")
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-md)]">
        <div className="flex gap-3">
          {tabs.map((tab) => {
            const isActive = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTab(tab.id)}
                className={[
                  "flex min-w-[90px] flex-col items-center justify-center rounded-xl border px-3 py-3 transition",
                  isActive
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-background)] shadow-md"
                    : "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] hover:border-[var(--color-primary)]/50",
                ].join(" ")}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span className="mt-1 text-xs font-semibold uppercase tracking-wide">
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="py-12 text-center text-lg font-semibold text-[var(--color-text-secondary)]">
          No {selectedTab.toLowerCase()} found here.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => {
            const isVideo =
              (selectedTab === "Videos" || selectedTab === "Animations") &&
              entry.name.toLowerCase().endsWith(".mp4");

            return (
              <div
                key={entry.name}
                role="button"
                tabIndex={0}
                onClick={() => openFile(entry)}
                onKeyDown={(e) => e.key === "Enter" && openFile(entry)}
                className="flex cursor-pointer items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-md)] transition hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-lg)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-2xl">
                  {getFileIcon(entry.name)}
                </div>
                <p className="flex-1 text-lg font-semibold text-[var(--color-text)]">
                  {cleanDisplayName(entry.name)}
                </p>
                <Button
                  size="sm"
                  variant={isVideo ? "primary" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    openFile(entry);
                  }}
                  fullWidth={false}
                >
                  {isVideo ? "Play" : "Open"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileBrowserView;
