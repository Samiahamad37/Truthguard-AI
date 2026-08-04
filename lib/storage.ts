const isBrowser = typeof window !== "undefined";

export function getStorageItem<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorageItem(key: string): void {
  if (!isBrowser) return;
  localStorage.removeItem(key);
}

export const STORAGE_KEYS = {
  USER: "truthguard_user",
  TOKEN: "truthguard_token",
  SETTINGS: "truthguard_settings",
  REPORTS: "truthguard_reports",
  HISTORY: "truthguard_history",
  ANALYSES: "truthguard_analyses",
  NOTIFICATIONS: "truthguard_notifications",
} as const;
