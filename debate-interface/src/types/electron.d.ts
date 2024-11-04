// src/types/electron.d.ts

import { Debate } from '../functions/types' // Adjust the import path as needed

declare global {
  interface Window {
    electronAPI: {
      readDebates: () => Promise<Debate[]>;
      readDebate: (id: string) => Promise<Debate>; // Return type should be Promise<Debate>      createDebate: (newDebate: Debate) => Promise<void>;
      updateDebate: (id: string, updatedDebate: Debate) => Promise<Debate>;
      deleteDebate: (id: string) => Promise<void>;
      createDebate: (newDebate: Omit<Debate, "id">) => Promise<Debate>;
    };
  }
}
