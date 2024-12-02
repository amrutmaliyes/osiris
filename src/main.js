const SQLite = require("better-sqlite3");
const { app, BrowserWindow, ipcMain } = require("electron");
const si = require("systeminformation");
const axios = require("axios");
const path = require("path");

const API_BASE_URL = "http://localhost:3001"; // Replace with your actual API URL
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
    if (response.data.activationStatus === "Active") {
      const stmt = db.prepare(`
        INSERT INTO Activations (
          email, organization_name, serial_mac_id,
          activation_code, start_date, end_date
        ) VALUES (?, ?, ?, ?, datetime('now'), datetime('now', '+1 year'))
      `);
      stmt.run(
        activationData.email,
        activationData.institutionName,
        activationData.serial_number,
        activationData.activation_key
      );
      return { success: true, data: response.data };
    }
    return { success: false, error: "Activation failed" };
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
