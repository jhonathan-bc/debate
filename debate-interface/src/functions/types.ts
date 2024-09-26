// types.ts
export interface Speech {
  speech: string;
  rebuttal: string;
  POI: string;
}

export interface Debate {
  motion: string;
  PM: Speech;
  LO: Speech;
  DPM: Speech;
  DLO: Speech;
  MG: Speech;
  MO: Speech;
  GW: Speech;
  OW: Speech;
  id: string;
}

export type SpeakerRole =
  | "PM"
  | "LO"
  | "DPM"
  | "DLO"
  | "MG"
  | "MO"
  | "GW"
  | "OW";
