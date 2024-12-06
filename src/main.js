const SQLite = require("better-sqlite3");
const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const si = require("systeminformation");
const axios = require("axios");
const path = require("path");
const fs = require('fs').promises;
const crypto = require('crypto');
const os = require('os');

const API_BASE_URL = "http://localhost:3001"; // Replace with your actual API URL
const db = new SQLite( "data.db");

// const db = new SQLite(path.join(app.getPath("userData"), "data.db"));

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
      name TEXT,
      mobile TEXT,
      department TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Activations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      organization_name TEXT NOT NULL,
      head_of_institution TEXT NOT NULL,
      mobile_no TEXT NOT NULL,
      serial_mac_id TEXT NOT NULL,
      activation_code TEXT NOT NULL UNIQUE,
      start_date DATETIME,
      end_date DATETIME,
      is_active INTEGER DEFAULT 1,
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

    if (response.data.activationStatus === "Active") {
      const { activation_date, expiry_date } = response.data;

      const insertActivationStmt = db.prepare(`
        INSERT INTO Activations (
          email,
          organization_name,
          head_of_institution,
          mobile_no,
          serial_mac_id,
          activation_code,
          start_date,
          end_date,
          is_active,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `);

      const insertUserStmt = db.prepare(`
        INSERT INTO Users (
          username, 
          password, 
          role, 
          mobile
        ) VALUES (?, ?, ?, ?)
      `);

      // Start a transaction to ensure both inserts succeed or fail together
      const transaction = db.transaction(() => {
        insertActivationStmt.run(
          activationData.email,
          activationData.institutionName,
          activationData.headOfInstitution,
          activationData.mobileNo,
          activationData.serial_number,
          activationData.activation_key,
          activation_date,
          expiry_date,
          1  // is_active value
        );

        insertUserStmt.run(
          activationData.email,
          activationData.password,
          'admin',
          activationData.mobileNo
        );
      });

      transaction();
      return { success: true, data: response.data };
    }

    return {
      success: false,
      error: {
        message: response.data.message || "Activation failed: Invalid or expired activation key"
      }
    };
  } catch (error) {
    console.error("Activation error:", error);
    return { 
      success: false, 
      error: {
        message: error.response?.data?.message || error.message || "Activation failed"
      }
    };
  }
});

ipcMain.handle("check-activation", async () => {
  try {
    const activation = db.prepare(`
      SELECT * FROM Activations 
      WHERE is_active = 1 
      ORDER BY created_at DESC 
      LIMIT 1
    `).get();

    console.log("Found activation:", activation); // Debug log

    if (!activation) return false;

    // Parse dates properly and handle timezone
    const endDate = new Date(activation.end_date);
    const now = new Date();

    console.log("Activation check:", {
      endDate: endDate.toISOString(),
      now: now.toISOString(),
      isValid: now <= endDate
    });

    if (now > endDate) {
      console.log("Activation expired, deactivating...");
      db.prepare(`
        UPDATE Activations 
        SET is_active = 0 
        WHERE id = ?
      `).run(activation.id);
      
      return false;
    }

    return true;
  } catch (error) {
    console.error("Activation check error:", error);
    return false;
  }
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

ipcMain.handle("get-user-details", async (event, userId) => {
  try {
    const stmt = db.prepare(`
      SELECT id, username, password, role, name, mobile, department
      FROM Users
      WHERE id = ?
    `);
    
    const user = stmt.get(userId);
    console.log("Retrieved user details:", user); // For debugging
    
    if (user) {
      return { success: true, user };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    console.error("Get user details error:", error);
    return { success: false, error: error.message };
  }
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

ipcMain.handle("openFile", async (event, { filePath, userId }) => {
  console.log('openFile called with:', { filePath, userId });
  
  let decryptedPath = null;
  try {
    // First verify the file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error('File does not exist:', filePath);
      throw new Error('File not found');
    }

    decryptedPath = await decryptFile(filePath);
    console.log('File decrypted to:', decryptedPath);
    
    // Get the active content path
    const activeContent = db.prepare('SELECT id FROM ContentPaths WHERE is_active = 1').get();
    if (!activeContent) {
      console.error('No active content path found');
      throw new Error('No active content path');
    }

    // Get the content item
    const contentItem = db.prepare(
      'SELECT id FROM ContentItems WHERE folder_id = ? AND title = ?'
    ).get(activeContent.id, path.basename(filePath));
    
    if (!contentItem) {
      console.error('Content item not found:', path.basename(filePath));
      throw new Error('Content item not found');
    }

    console.log('Found content item:', contentItem);

    // Check for existing progress
    const existingProgress = db.prepare(`
      SELECT id FROM ContentProgress 
      WHERE user_id = ? AND content_item_id = ?
    `).get(userId, contentItem.id);

    if (existingProgress) {
      console.log('Updating existing progress');
      db.prepare(`
        UPDATE ContentProgress 
        SET completion_percentage = 100,
            status = 'completed',
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND content_item_id = ?
      `).run(userId, contentItem.id);
    } else {
      console.log('Creating new progress record');
      db.prepare(`
        INSERT INTO ContentProgress (
          user_id,
          folder_id,
          content_item_id,
          completion_percentage,
          status
        ) VALUES (?, ?, ?, 100, 'completed')
      `).run(userId, activeContent.id, contentItem.id);
    }

    // Open file with default application
    console.log('Opening file:', decryptedPath);
    const result = await shell.openPath(decryptedPath);
    if (result !== '') {
      console.error('Failed to open file:', result);
      throw new Error(`Failed to open file: ${result}`);
    }

    // Cleanup after delay
    setTimeout(async () => {
      try {
        await fs.unlink(decryptedPath);
      } catch (error) {
        console.error('Error cleaning up temp file:', error);
      }
    }, 10000);

    return { success: true, filePath: decryptedPath };
  } catch (error) {
    console.error('Error in openFile:', error);
    if (decryptedPath) {
      try {
        await fs.unlink(decryptedPath);
      } catch (unlinkError) {
        console.error('Error cleaning up after failure:', unlinkError);
      }
    }
    return { success: false, error: error.message };
  }
});

ipcMain.handle("handleFileError", async (event, error) => {
  console.error('File handling error:', error);
  return { success: false, error: error.message };
});

// Add user to database
ipcMain.handle("add-user", async (event, userData) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO Users (
        username, password, role, name, mobile, department
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      userData.username,
      userData.password,
      userData.role,
      userData.name || null,
      userData.mobile || null,
      userData.department || null
    );

    return { success: true, id: result.lastInsertRowid };
  } catch (error) {
    console.error("Add user error:", error);
    return { success: false, error: error.message };
  }
});

// Get all users
ipcMain.handle("get-users", () => {
  try {
    const stmt = db.prepare(`
      SELECT id, username, role, name, mobile, department
      FROM Users
      ORDER BY created_at DESC
    `);
    return stmt.all();
  } catch (error) {
    console.error("Get users error:", error);
    return [];
  }
});

// Login user
ipcMain.handle("login-user", async (event, username, password) => {
  try {
    console.log("Login attempt with:", { username, password });

    const stmt = db.prepare(`
      SELECT id, username, role
      FROM Users
      WHERE username = ? AND password = ?
    `);
    
    const user = stmt.get(username, password);
    console.log("Found user:", user);
    
    if (user) {
      return { 
        success: true, 
        user: {
          id: user.id,        // Make sure id is included
          username: user.username,
          role: user.role
        } 
      };
    } else {
      return { success: false, error: "Invalid credentials" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
});

// Debug handler
ipcMain.handle("debug-users", () => {
  try {
    const stmt = db.prepare("SELECT * FROM Users");
    const users = stmt.all();
    console.log("All users in database:", users);
    return users;
  } catch (error) {
    console.error("Debug users error:", error);
    return [];
  }
});

// Add these new handlers
ipcMain.handle("update-user", async (event, userData) => {
  try {
    const stmt = db.prepare(`
      UPDATE Users 
      SET username = ?, name = ?, mobile = ?, role = ?, department = ?
      ${userData.password ? ', password = ?' : ''}
      WHERE id = ?
    `);
    
    const params = [
      userData.username,
      userData.name,
      userData.mobile,
      userData.role,
      userData.department,
      ...(userData.password ? [userData.password] : []),
      userData.id
    ];

    const result = stmt.run(...params);
    return { success: true, changes: result.changes };
  } catch (error) {
    console.error("Update user error:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("delete-user", async (event, userId) => {
  try {
    console.log("Attempting to delete user:", userId); // For debugging
    
    const stmt = db.prepare('DELETE FROM Users WHERE id = ?');
    const result = stmt.run(userId);
    
    console.log("Delete result:", result); // For debugging
    
    if (result.changes > 0) {
      return { success: true, changes: result.changes };
    } else {
      return { success: false, error: "User not found or could not be deleted" };
    }
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, error: error.message };
  }
});

// Get organization details
ipcMain.handle("get-organization-details", async () => {
  try {
    const stmt = db.prepare(`
      SELECT 
        organization_name,
        email,
        mobile_no,
        head_of_institution,
        start_date,
        end_date,
        created_at
      FROM Activations
      ORDER BY created_at DESC
      LIMIT 1
    `);
    
    const data = stmt.get();
    
    if (!data) {
      return { success: false, error: "No activation found" };
    }

    // Calculate days consumed and remaining
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    const today = new Date();

    const daysConsumed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));
  // console.log();

    return {
      success: true,
      data: {
        ...data,
        daysConsumed: Math.max(0, daysConsumed),
        daysLeft: Math.max(0, daysLeft)
      }
    };
  } catch (error) {
    console.error("Error getting organization details:", error);
    return { success: false, error: error.message };
  }
});

// Update organization details
ipcMain.handle("update-organization-details", async (event, data) => {
  try {
    const stmt = db.prepare(`
      UPDATE Activations 
      SET 
        organization_name = ?,
        mobile_no = ?,
        head_of_institution = ?,
        updated_at = datetime('now')
      WHERE id = (
        SELECT id FROM Activations 
        ORDER BY created_at DESC 
        LIMIT 1
      )
    `);
    
    const result = stmt.run(
      data.organization_name,
      data.mobile_no,
      data.head_of_institution
    );

    if (result.changes > 0) {
      return { success: true };
    } else {
      return { success: false, error: "No records were updated" };
    }
  } catch (error) {
    console.error("Error updating organization details:", error);
    return { success: false, error: error.message };
  }
});

// Add these new handlers
ipcMain.handle("add-content-item", async (event, data) => {
  try {
    // First check if the content item already exists
    const checkStmt = db.prepare(`
      SELECT id FROM ContentItems 
      WHERE folder_id = ? AND title = ?
    `);
    
    let existingItem = checkStmt.get(data.folderId, data.title);
    
    if (existingItem) {
      return { success: true, id: existingItem.id };
    }

    // If it doesn't exist, insert it
    const insertStmt = db.prepare(`
      INSERT INTO ContentItems (
        folder_id, 
        title, 
        description
      ) VALUES (?, ?, ?)
    `);
    
    const result = insertStmt.run(
      data.folderId,
      data.title,
      data.description
    );

    // Initialize progress records for all users
    const users = db.prepare('SELECT id FROM Users').all();
    const progressStmt = db.prepare(`
      INSERT INTO ContentProgress (
        user_id,
        folder_id,
        content_item_id,
        completion_percentage,
        status
      ) VALUES (?, ?, ?, 0, 'not-started')
    `);

    for (const user of users) {
      progressStmt.run(
        user.id,
        data.folderId,
        result.lastInsertRowid
      );
    }
    
    return { success: true, id: result.lastInsertRowid };
  } catch (error) {
    console.error("Error adding content item:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("update-content-progress", async (event, data) => {
  try {
    // First check if progress already exists
    const checkStmt = db.prepare(`
      SELECT id FROM ContentProgress 
      WHERE user_id = ? AND content_item_id = ?
    `);
    
    const existingProgress = checkStmt.get(data.userId, data.contentItemId);
    
    let stmt;
    if (existingProgress) {
      // Update existing progress
      stmt = db.prepare(`
        UPDATE ContentProgress 
        SET completion_percentage = ?,
            status = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND content_item_id = ?
      `);
      
      stmt.run(
        data.completionPercentage,
        data.status,
        data.userId,
        data.contentItemId
      );
    } else {
      // Insert new progress
      stmt = db.prepare(`
        INSERT INTO ContentProgress (
          user_id,
          folder_id,
          content_item_id,
          completion_percentage,
          status
        ) VALUES (?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        data.userId,
        data.folderId,
        data.contentItemId,
        data.completionPercentage,
        data.status
      );
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error updating content progress:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("get-content-progress", async (event, userId) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        cp.*,
        ci.title,
        ci.description,
        cp.completion_percentage
      FROM ContentProgress cp
      JOIN ContentItems ci ON cp.content_item_id = ci.id
      WHERE cp.user_id = ?
    `);
    
    const progress = stmt.all(userId);
    return { success: true, progress };
  } catch (error) {
    console.error("Error getting content progress:", error);
    return { success: false, error: error.message };
  }
});

// Debug helper to check tables
ipcMain.handle("debug-tables", async () => {
  try {
    const contentPaths = db.prepare("SELECT * FROM ContentPaths").all();
    const contentItems = db.prepare("SELECT * FROM ContentItems").all();
    const contentProgress = db.prepare("SELECT * FROM ContentProgress").all();
    
    console.log('ContentPaths:', contentPaths);
    console.log('ContentItems:', contentItems);
    console.log('ContentProgress:', contentProgress);
    
    return { contentPaths, contentItems, contentProgress };
  } catch (error) {
    console.error("Debug tables error:", error);
    return { error: error.message };
  }
});

// Add this new handler to get content item by folder ID and title
ipcMain.handle("getContentItem", async (event, folderId, title) => {
  try {
    const stmt = db.prepare(`
      SELECT id 
      FROM ContentItems 
      WHERE folder_id = ? AND title = ?
    `);
    
    const contentItem = stmt.get(folderId, title);
    
    if (contentItem) {
      return { success: true, id: contentItem.id };
    } else {
      return { success: false, error: "Content item not found" };
    }
  } catch (error) {
    console.error("Error getting content item:", error);
    return { success: false, error: error.message };
  }
});

// Add new IPC handlers for reactivation
ipcMain.handle("reactivate-product", async (event, activationData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/product-keys/reactivation`,
      {
        product_key: activationData.activation_key,
        serial_number: activationData.serial_number,
        version: activationData.version
      }
    );

    if (response.data.data.activationStatus === "Active") {
      // First check if there's an existing activation
      const checkStmt = db.prepare("SELECT COUNT(*) as count FROM Activations");
      const { count } = checkStmt.get();

      const endDate = new Date(response.data.data.expiryDate);
      const formattedEndDate = endDate.toISOString().replace('T', ' ').replace('Z', '');

      if (count === 0) {
        // No existing activation - Insert new record
        const insertStmt = db.prepare(`
          INSERT INTO Activations (
            email,
            organization_name,
            head_of_institution,
            mobile_no,
            serial_mac_id,
            activation_code,
            start_date,
            end_date,
            is_active,
            created_at
          ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), ?, 1, datetime('now'))
        `);

        // Get existing user details for reactivation
        const userStmt = db.prepare("SELECT * FROM Users WHERE role = 'admin' LIMIT 1");
        const existingUser = userStmt.get();

        insertStmt.run(
          existingUser?.username || '', // fallback email
          '',  // placeholder
          '', // placeholder
          existingUser?.mobile || '', // fallback mobile
          activationData.serial_number,
          activationData.activation_key,
          formattedEndDate
        );
      } else {
        // Existing activation - Update record
        const updateStmt = db.prepare(`
          UPDATE Activations 
          SET 
            start_date = datetime('now'),
            end_date = ?,
            is_active = 1,
            activation_code = ?,
            serial_mac_id = ?,
            updated_at = datetime('now')
          WHERE id = (
            SELECT id FROM Activations 
            ORDER BY created_at DESC 
            LIMIT 1
          )
        `);

        updateStmt.run(
          formattedEndDate,
          activationData.activation_key,
          activationData.serial_number
        );
      }

      return { 
        success: true, 
        data: response.data.data 
      };
    }

    return {
      success: false,
      error: {
        message: response.data.message || "Reactivation failed"
      }
    };
  } catch (error) {
    console.error("Reactivation error:", error);
    return { 
      success: false, 
      error: {
        message: error.response?.data?.message || error.message || "Reactivation failed"
      }
    };
  }
});

ipcMain.handle("update-activation", async (event, activationData) => {
  try {
    // Ensure the dates are valid ISO strings
    const startDate = new Date(activationData.start_date);
    const endDate = new Date(activationData.end_date);

    if (isNaN(startDate) || isNaN(endDate)) {
      throw new Error("Invalid date format");
    }

    // Format dates properly for SQLite
    const formattedStartDate = startDate.toISOString().replace('T', ' ').replace('Z', '');
    const formattedEndDate = endDate.toISOString().replace('T', ' ').replace('Z', '');

    // Update the existing activation record
    const updateStmt = db.prepare(`
      UPDATE Activations 
      SET 
        activation_code = ?,
        serial_mac_id = ?,
        start_date = ?,
        end_date = ?,
        is_active = 1,
        updated_at = datetime('now')
      WHERE id = (
        SELECT id FROM Activations 
        ORDER BY created_at DESC 
        LIMIT 1
      )
    `);

    console.log("Updating activation with data:", {
      activation_code: activationData.activation_key,
      serial_mac_id: activationData.serial_number,
      start_date: formattedStartDate,
      end_date: formattedEndDate
    });

    updateStmt.run(
      activationData.activation_key,
      activationData.serial_number,
      formattedStartDate,
      formattedEndDate
    );

    return { success: true };
  } catch (error) {
    console.error("Update activation error:", error);
    return { 
      success: false, 
      error: {
        message: error.message || "Failed to update activation"
      }
    };
  }
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
