import { ipcRenderer, contextBridge } from 'electron'
import { Debate } from '../src/functions/types';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("electronAPI", {
  readDebates: () => ipcRenderer.invoke("read-debates"),
  readDebate: (id: string) => ipcRenderer.invoke('read-debate', id),
  createDebate: (newDebate:Omit<Debate, "id">) => ipcRenderer.invoke("create-debate", newDebate),
  updateDebate: (id:string, updatedDebate:Debate) => ipcRenderer.invoke("update-debate", id, updatedDebate),
  deleteDebate: (id:string) => ipcRenderer.invoke("delete-debate", id),
});
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})
