import { create } from "zustand";

const STORAGE_KEY = "saci.timer";

export interface PersistedTimer {
  duration: number; // ms
  startTime: number; // epoch ms
}

interface TimerState {
  duration: number; // ms; 0 = idle
  startTime: number | null;
  isFinished: boolean;
  start: (durationMs: number) => void;
  finish: () => void;
  reset: () => void;
  hydrate: () => void;
}

function persist(duration: number, startTime: number) {
  if (typeof window === "undefined") return;
  try {
    const payload: PersistedTimer = { duration, startTime };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

function clearPersisted() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export const useTimer = create<TimerState>((set) => ({
  duration: 0,
  startTime: null,
  isFinished: false,

  start: (durationMs) => {
    const startTime = Date.now();
    persist(durationMs, startTime);
    set({ duration: durationMs, startTime, isFinished: false });
  },

  finish: () => {
    clearPersisted();
    set({ isFinished: true });
  },

  reset: () => {
    clearPersisted();
    set({ duration: 0, startTime: null, isFinished: false });
  },

  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PersistedTimer;
      if (
        !parsed ||
        typeof parsed.duration !== "number" ||
        typeof parsed.startTime !== "number"
      ) {
        clearPersisted();
        return;
      }
      const elapsed = Date.now() - parsed.startTime;
      if (elapsed >= parsed.duration) {
        clearPersisted();
        return;
      }
      set({
        duration: parsed.duration,
        startTime: parsed.startTime,
        isFinished: false,
      });
    } catch {
      clearPersisted();
    }
  },
}));

export function readPersistedTimer(): PersistedTimer | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedTimer;
  } catch {
    return null;
  }
}
