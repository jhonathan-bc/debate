import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid"; // Add this import at the top

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFilePath = path.join(__dirname, "../src/data/db.json");

process.env.APP_ROOT = path.join(__dirname, "..");
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

// Type definitions
interface Speech {
  speech: string;
  rebuttal: string;
  POI: string;
}

interface Debate {
  id: string;
  motion: string;
  PM: Speech;
  LO: Speech;
  DPM: Speech;
  DLO: Speech;
  MG: Speech;
  MO: Speech;
  GW: Speech;
  OW: Speech;
}

interface Database {
  debates: Debate[];
}

// Helper function to read and parse JSON data
async function readData(): Promise<Database> {
  const data = await fs.readFile(dataFilePath, "utf8");
  return JSON.parse(data) as Database;
}

// Helper function to write JSON data
async function writeData(data: Database): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

// IPC handlers for CRUD operations
ipcMain.handle("read-debates", async (): Promise<Debate[]> => {
  const data = await readData();
  return data.debates;
});

ipcMain.handle(
  "read-debate",
  async (
    _: IpcMainInvokeEvent,
    id: string
  ): Promise<Debate | { error: string }> => {
    try {
      const data = await readData(); // Read data from JSON file
      const debate = data.debates.find((debate) => debate.id === id); // Find the debate by ID

      if (!debate) {
        return { error: "Debate not found" }; // Return an error if not found
      }

      return debate; // Return the found debate
    } catch (error) {
      console.error("Error reading debate:", error);
      return { error: (error as Error).message }; // Return an error message
    }
  }
);

ipcMain.handle(
  "create-debate",
  async (
    _: IpcMainInvokeEvent,
    newDebate: Omit<Debate, "id">
  ): Promise<Debate> => {
    try {
      const data = await readData();
      const debateWithId: Debate = { ...newDebate, id: uuidv4() }; // Generate a new ID and create full Debate object
      data.debates.push(debateWithId);
      await writeData(data);
      return debateWithId; // Return the newly created debate object including the ID
    } catch (error) {
      console.error("Error creating debate:", error);
      throw new Error((error as Error).message); // Rethrow the error for handling in the renderer
    }
  }
);

ipcMain.handle(
  "update-debate",
  async (
    _: IpcMainInvokeEvent,
    id: string,
    updatedDebate: Partial<Debate>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const data = await readData();
      const debateIndex = data.debates.findIndex((debate) => debate.id === id);
      if (debateIndex === -1)
        return { success: false, error: "Debate not found" };

      data.debates[debateIndex] = {
        ...data.debates[debateIndex],
        ...updatedDebate,
      };
      await writeData(data);
      return { success: true };
    } catch (error) {
      console.error("Error updating debate:", error);
      return { success: false, error: (error as Error).message };
    }
  }
);

ipcMain.handle(
  "delete-debate",
  async (
    _: IpcMainInvokeEvent,
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const data = await readData();
      const newDebates = data.debates.filter((debate) => debate.id !== id);

      if (data.debates.length === newDebates.length)
        return { success: false, error: "Debate not found" };

      await writeData({ debates: newDebates });
      return { success: true };
    } catch (error) {
      console.error("Error deleting debate:", error);
      return { success: false, error: (error as Error).message };
    }
  }
);

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "debate_logo.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
