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
  const macAddress = await si.networkInterfaces();
  return {
    serialNumber: uuid.hardware,
    macAddress: macAddress[0]?.mac || "",
  };
});

ipcMain.handle("activate-product", async (event, activationData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/products-keys/activation`,
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
        activationData.serialNumber,
        response.data.activation_key
      );
      return { success: true, data: response.data };
    }
    return { success: false, error: "Activation failed" };
  } catch (error) {
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

// const SQLite = require("better-sqlite3");
// const { app, BrowserWindow, ipcMain } = require("electron");
// const si = require("systeminformation");
// const axios = require("axios");
// const path = require("path");

// const API_BASE_URL = "http://localhost:3000"; // Update with your API URL
// const dbPath = path.join(app.getPath("userData"), "data.db");
// const db = new SQLite(dbPath);

// console.log(`Database file created at: ${dbPath}`);

// if (require("electron-squirrel-startup")) {
//   app.quit();
// }

// const initDb = () => {
//   try {
//     db.exec(`
//       CREATE TABLE IF NOT EXISTS Users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         username TEXT NOT NULL UNIQUE,
//         password TEXT NOT NULL,
//         role TEXT NOT NULL,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
//       );

//       CREATE TABLE IF NOT EXISTS Activations (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         email TEXT NOT NULL,
//         organization_name TEXT NOT NULL,
//         serial_mac_id TEXT NOT NULL,
//         activation_code TEXT NOT NULL UNIQUE,
//         start_date DATETIME,
//         end_date DATETIME,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
//       );

//       CREATE TABLE IF NOT EXISTS ContentPaths (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         path TEXT NOT NULL UNIQUE,
//         is_active BOOLEAN DEFAULT 0,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
//       );

//       CREATE TABLE IF NOT EXISTS ContentItems (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         folder_id INTEGER,
//         title TEXT NOT NULL,
//         description TEXT,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (folder_id) REFERENCES ContentPaths(id)
//       );

//       CREATE TABLE IF NOT EXISTS ContentProgress (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         user_id INTEGER,
//         folder_id INTEGER,
//         content_item_id INTEGER,
//         completion_percentage INTEGER DEFAULT 0,
//         status TEXT DEFAULT 'in-progress',
//         updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES Users(id),
//         FOREIGN KEY (folder_id) REFERENCES ContentPaths(id),
//         FOREIGN KEY (content_item_id) REFERENCES ContentItems(id)
//       );
//     `);

//     // Verify tables were created
//     const tables = db
//       .prepare(
//         `
//       SELECT name FROM sqlite_master
//       WHERE type='table'
//       ORDER BY name;
//     `
//       )
//       .all();

//     console.log("Database initialized successfully!");
//     console.log(
//       "Created tables:",
//       tables.map((t) => t.name)
//     );

//     // Show row counts for each table
//     tables.forEach((table) => {
//       const count = db
//         .prepare(`SELECT COUNT(*) as count FROM ${table.name}`)
//         .get();
//       console.log(`Table ${table.name}: ${count.count} rows`);
//     });
//   } catch (error) {
//     console.error("Database initialization failed:", error);
//   }
// };

// const createWindow = () => {
//   const mainWindow = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
//       contextIsolation: true,
//       nodeIntegration: false,
//     },
//   });

//   initDb();
//   mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
//   // Open DevTools in development
//   mainWindow.webContents.openDevTools();

//   // Check if app is activated
//   const checkActivation = db.prepare("SELECT * FROM Activations LIMIT 1");
//   const activation = checkActivation.get();
//   if (!activation) {
//     mainWindow.webContents.once("dom-ready", () => {
//       mainWindow.webContents.send("check-activation", false);
//     });
//   }

//   console.log("Activation status:", !!activation);
// };

// // IPC Handlers
// ipcMain.handle("get-system-info", async () => {
//   try {
//     const uuid = await si.uuid();
//     const networkInterfaces = await si.networkInterfaces();
//     const systemInfo = {
//       serialNumber: uuid.hardware,
//       macAddress: networkInterfaces[0]?.mac || "",
//     };
//     console.log("System Info:", systemInfo);
//     return systemInfo;
//   } catch (error) {
//     console.error("Error getting system info:", error);
//     throw error;
//   }
// });

// ipcMain.handle("activate-product", async (event, activationData) => {
//   try {
//     console.log("Activation request data:", activationData);

//     const response = await axios.post(`${API_BASE_URL}/activation`, {
//       activation_key: activationData.activation_key,
//       serial_number: activationData.serial_number,
//       version: activationData.version,
//       email: activationData.email,
//       organization_name: activationData.institutionName,
//       head_of_institution: activationData.headOfInstitution,
//       mobile_no: activationData.mobileNo,
//       password: activationData.password,
//     });

//     console.log("API Response:", response.data);

//     if (response.data && response.data.activationStatus === "Active") {
//       try {
//         // Begin transaction
//         db.transaction(() => {
//           // Insert activation record
//           const activationStmt = db.prepare(`
//             INSERT INTO Activations (
//               email,
//               organization_name,
//               serial_mac_id,
//               activation_code,
//               start_date,
//               end_date
//             ) VALUES (?, ?, ?, ?, datetime('now'), datetime('now', '+1 year'))
//           `);

//           const activationResult = activationStmt.run(
//             activationData.email,
//             activationData.institutionName,
//             activationData.serial_number,
//             activationData.activation_key
//           );

//           console.log(
//             "Activation record created:",
//             activationResult.lastInsertRowid
//           );

//           // Insert user record
//           const userStmt = db.prepare(`
//             INSERT INTO Users (
//               username,
//               password,
//               role
//             ) VALUES (?, ?, ?)
//           `);

//           const userResult = userStmt.run(
//             activationData.email,
//             activationData.password,
//             "admin"
//           );

//           console.log("User record created:", userResult.lastInsertRowid);
//         })();

//         // Show updated counts
//         const activationCount = db
//           .prepare("SELECT COUNT(*) as count FROM Activations")
//           .get();
//         const userCount = db
//           .prepare("SELECT COUNT(*) as count FROM Users")
//           .get();
//         console.log(`Total activations: ${activationCount.count}`);
//         console.log(`Total users: ${userCount.count}`);

//         return {
//           success: true,
//           data: response.data,
//         };
//       } catch (dbError) {
//         console.error("Database error:", dbError);
//         return {
//           success: false,
//           error: "Failed to save activation data",
//         };
//       }
//     }
//     return {
//       success: false,
//       error: response.data.message || "Activation failed",
//     };
//   } catch (error) {
//     console.error("Activation error:", error);
//     return {
//       success: false,
//       error: error.response?.data?.message || error.message,
//     };
//   }
// });

// ipcMain.handle("check-activation", () => {
//   try {
//     const stmt = db.prepare("SELECT * FROM Activations LIMIT 1");
//     const activation = stmt.get();
//     console.log("Checking activation status:", !!activation);
//     return !!activation;
//   } catch (error) {
//     console.error("Check activation error:", error);
//     return false;
//   }
// });

// // App lifecycle events
// app.whenReady().then(createWindow);

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });

// // Error handling for uncaught exceptions
// process.on("uncaughtException", (error) => {
//   console.error("Uncaught exception:", error);
// });

// process.on("unhandledRejection", (error) => {
//   console.error("Unhandled rejection:", error);
// });
