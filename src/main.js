const SQLite = require("better-sqlite3");
const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const si = require("systeminformation");
const axios = require("axios");
const path = require("path");
const fs = require('fs').promises;
const crypto = require('crypto');
const os = require('os');

const API_BASE_URL = "http://localhost:3001"; // Replace with your actual API URL
// const db = new SQLite( "data.db");

const db = new SQLite(path.join(app.getPath("userData"), "data.db"));

if (require("electron-squirrel-startup")) {
  app.quit();
}

const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Activations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      organization_name TEXT NOT NULL,
      serial_mac_id TEXT NOT NULL,
      activation_code TEXT NOT NULL UNIQUE,
      start_date DATETIME,
      end_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ContentPaths (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL UNIQUE,
      is_active BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ContentItems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      folder_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (folder_id) REFERENCES ContentPaths(id)
    );

    CREATE TABLE IF NOT EXISTS ContentProgress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      folder_id INTEGER,
      content_item_id INTEGER,
      completion_percentage INTEGER DEFAULT 0,
      status TEXT DEFAULT 'in-progress',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(id),
      FOREIGN KEY (folder_id) REFERENCES ContentPaths(id),
      FOREIGN KEY (content_item_id) REFERENCES ContentItems(id)
    );
  `);
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  initDb();
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  // Check if app is activated
  const checkActivation = db.prepare("SELECT * FROM Activations LIMIT 1");
  const activation = checkActivation.get();
  if (!activation) {
    mainWindow.webContents.once("dom-ready", () => {
      mainWindow.webContents.send("check-activation", false);
    });
  }
};

// IPC Handlers
ipcMain.handle("get-system-info", async () => {
  console.log("Here Inside Main System Info");
  const uuid = await si.uuid();
  console.log(uuid,"uuid")
  return uuid
  // const macAddress = await si.networkInterfaces();
  // console.log(macAddress,"macaddresss")
  // return {
  //   serialNumber: uuid.hardware,
  //   macAddress: macAddress[1]?.mac || "",
  // };
});

ipcMain.handle("activate-product", async (event, activationData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/product-keys/activation`,
      activationData
    );

    // Only insert into database if activation is successful
    if (response.data.activationStatus === "Active") {
      const insertActivationStmt = db.prepare(`
        INSERT INTO Activations (
          email, organization_name, serial_mac_id,
          activation_code, start_date, end_date
        ) VALUES (?, ?, ?, ?, datetime('now'), datetime('now', '+1 year'))
      `);

      const insertUserStmt = db.prepare(`
        INSERT INTO Users (
          username, password, role
        ) VALUES (?, ?, ?)
      `);

      // Start a transaction to ensure both inserts succeed or fail together
      const transaction = db.transaction(() => {
        insertActivationStmt.run(
          activationData.email,
          activationData.institutionName,
          activationData.serial_number,
          activationData.activation_key
        );

        insertUserStmt.run(
          activationData.email,
          activationData.password, // Assuming password is already hashed
          'admin'
        );
      });

      transaction();

      // Return the full response data so frontend can check activation status
      return { success: true, data: response.data };
    }

    return {
      success: false,
      error: "Activation failed: Invalid or expired activation key"
    };
  } catch (error) {
    console.error("Activation error:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("check-activation", () => {
  const stmt = db.prepare("SELECT * FROM Activations LIMIT 1");
  const activation = stmt.get();
  return !!activation;
});

ipcMain.handle("get-activation-credentials", () => {
  const stmt = db.prepare(`
    SELECT email, password 
    FROM Activations 
    ORDER BY created_at DESC 
    LIMIT 1
  `);
  const credentials = stmt.get();
  return credentials;
});

ipcMain.handle("get-user-credentials", () => {
  const stmt = db.prepare(`
    SELECT username, password 
    FROM Users 
    WHERE role = 'admin'
    ORDER BY created_at DESC 
    LIMIT 1
  `);
  const credentials = stmt.get();
  return credentials;
});

ipcMain.handle("add-content-path", async (event, contentPath) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO ContentPaths (path, is_active)
      VALUES (?, 0)
    `);
    const result = stmt.run(contentPath);
    return { success: true, id: result.lastInsertRowid };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("get-content-paths", () => {
  const stmt = db.prepare(`
    SELECT id, path, is_active, created_at
    FROM ContentPaths
    ORDER BY created_at DESC
  `);
  return stmt.all();
});

ipcMain.handle("set-active-content", async (event, contentId) => {
  try {
    const transaction = db.transaction(() => {
      // First, deactivate all content paths
      db.prepare('UPDATE ContentPaths SET is_active = 0').run();
      // Then, activate the selected content path
      db.prepare('UPDATE ContentPaths SET is_active = 1 WHERE id = ?').run(contentId);
    });
    transaction();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("delete-content-path", async (event, contentId) => {
  try {
    const stmt = db.prepare('DELETE FROM ContentPaths WHERE id = ?');
    stmt.run(contentId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Select Content Folder'
  });
  
  if (!result.canceled) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle("readDirectory", async (event, dirPath) => {
  try {
    const items = await fs.readdir(dirPath);
    return items;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
});

ipcMain.handle("openFile", async (event, filePath) => {
  let decryptedPath = null;
  try {
    decryptedPath = await decryptFile(filePath);
    
    // Check if file exists and has content
    const stats = await fs.stat(decryptedPath);
    if (stats.size === 0) {
      throw new Error('Decrypted file is empty');
    }

    // Open file with default application
    const result = await shell.openPath(decryptedPath);
    if (result !== '') {
      throw new Error(`Failed to open file: ${result}`);
    }

    // Cleanup after a longer delay to ensure file opens
    setTimeout(async () => {
      try {
        await fs.unlink(decryptedPath);
      } catch (error) {
        console.error('Error cleaning up temp file:', error);
      }
    }, 10000); // 10 seconds delay

    return { success: true, filePath: decryptedPath };
  } catch (error) {
    if (decryptedPath) {
      try {
        await fs.unlink(decryptedPath);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    }
    console.error('Error handling file:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("handleFileError", async (event, error) => {
  console.error('File handling error:', error);
  return { success: false, error: error.message };
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Use the same key that was used for encryption
const KEY = "iactive@2024";

async function decryptFile(filePath) {
  try {
    const data = await fs.readFile(filePath);
    const iv = data.slice(0, 16);
    const authTag = data.slice(16, 32);
    const encryptedData = data.slice(32);

    const secretKey = crypto.createHash("sha256").update(KEY).digest();
    const decipher = crypto.createDecipheriv("aes-256-gcm", secretKey, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final()
    ]);

    // Preserve the original file extension
    const originalFileName = path.basename(filePath);
    const fileExtension = path.extname(originalFileName);
    const tempDir = os.tmpdir();
    const decryptedFilePath = path.join(tempDir, `dec_${Date.now()}${fileExtension}`);

    await fs.writeFile(decryptedFilePath, decrypted);
    return decryptedFilePath;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt file');
  }
}
