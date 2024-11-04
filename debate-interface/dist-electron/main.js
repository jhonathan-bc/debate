import { ipcMain as i, app as b, BrowserWindow as g } from "electron";
import { fileURLToPath as D } from "node:url";
import o from "node:path";
import _ from "fs/promises";
import { randomFillSync as P, randomUUID as f } from "crypto";
const a = [];
for (let e = 0; e < 256; ++e)
  a.push((e + 256).toString(16).slice(1));
function U(e, t = 0) {
  return (a[e[t + 0]] + a[e[t + 1]] + a[e[t + 2]] + a[e[t + 3]] + "-" + a[e[t + 4]] + a[e[t + 5]] + "-" + a[e[t + 6]] + a[e[t + 7]] + "-" + a[e[t + 8]] + a[e[t + 9]] + "-" + a[e[t + 10]] + a[e[t + 11]] + a[e[t + 12]] + a[e[t + 13]] + a[e[t + 14]] + a[e[t + 15]]).toLowerCase();
}
const u = new Uint8Array(256);
let l = u.length;
function T() {
  return l > u.length - 16 && (P(u), l = 0), u.slice(l, l += 16);
}
const h = { randomUUID: f };
function x(e, t, r) {
  if (h.randomUUID && !t && !e)
    return h.randomUUID();
  e = e || {};
  const n = e.random || (e.rng || T)();
  return n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, U(n);
}
const m = o.dirname(D(import.meta.url)), E = o.join(m, "../src/data/db.json");
process.env.APP_ROOT = o.join(m, "..");
const w = process.env.VITE_DEV_SERVER_URL, V = o.join(process.env.APP_ROOT, "dist-electron"), y = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = w ? o.join(process.env.APP_ROOT, "public") : y;
let s;
async function c() {
  const e = await _.readFile(E, "utf8");
  return JSON.parse(e);
}
async function p(e) {
  await _.writeFile(E, JSON.stringify(e, null, 2));
}
i.handle("read-debates", async () => (await c()).debates);
i.handle("read-debate", async (e, t) => {
  try {
    const n = (await c()).debates.find((d) => d.id === t);
    return n || { error: "Debate not found" };
  } catch (r) {
    return console.error("Error reading debate:", r), { error: r.message };
  }
});
i.handle("create-debate", async (e, t) => {
  try {
    const r = await c(), n = { ...t, id: x() };
    return r.debates.push(n), await p(r), n;
  } catch (r) {
    throw console.error("Error creating debate:", r), new Error(r.message);
  }
});
i.handle("update-debate", async (e, t, r) => {
  try {
    const n = await c(), d = n.debates.findIndex((R) => R.id === t);
    return d === -1 ? { success: !1, error: "Debate not found" } : (n.debates[d] = { ...n.debates[d], ...r }, await p(n), { success: !0 });
  } catch (n) {
    return console.error("Error updating debate:", n), { success: !1, error: n.message };
  }
});
i.handle("delete-debate", async (e, t) => {
  try {
    const r = await c(), n = r.debates.filter((d) => d.id !== t);
    return r.debates.length === n.length ? { success: !1, error: "Debate not found" } : (await p({ debates: n }), { success: !0 });
  } catch (r) {
    return console.error("Error deleting debate:", r), { success: !1, error: r.message };
  }
});
function I() {
  s = new g({
    icon: o.join(process.env.VITE_PUBLIC, "debate_logo.ico"),
    webPreferences: {
      preload: o.join(m, "preload.mjs"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), s.webContents.on("did-finish-load", () => {
    s == null || s.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), w ? s.loadURL(w) : s.loadFile(o.join(y, "index.html"));
}
b.on("window-all-closed", () => {
  process.platform !== "darwin" && (b.quit(), s = null);
});
b.on("activate", () => {
  g.getAllWindows().length === 0 && I();
});
b.whenReady().then(I);
export {
  V as MAIN_DIST,
  y as RENDERER_DIST,
  w as VITE_DEV_SERVER_URL
};
