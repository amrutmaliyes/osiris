export interface FileEntry {
    name: string;
    isDirectory: boolean;
    originalName?: string;
}

// User interface for frontend consumption
export interface User {
    id: number | null; // ID can be null for new users (before saving to DB)
    name: string; // Frontend display name (maps to username in backend)
    role: string; // e.g., "admin", "user"
    password?: string; // Optional for frontend display, but required for backend add/update
} 