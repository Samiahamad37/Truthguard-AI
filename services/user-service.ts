import type { User, UserSettings, NotificationPreferences } from "@/types";
import apiClient from "@/services/api-client";
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from "@/lib/storage";

const defaultNotificationPrefs: NotificationPreferences = {
  emailAnalysis: true,
  emailSecurity: true,
  emailUpdates: false,
  pushAnalysis: true,
  pushSecurity: true,
};

const defaultSettings: UserSettings = {
  notifications: defaultNotificationPrefs,
};

function cacheUser(user: User): User {
  setStorageItem(STORAGE_KEYS.USER, user);
  return user;
}

function cacheToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
}

export function getCurrentUser(): User | null {
  return getStorageItem<User | null>(STORAGE_KEYS.USER, null);
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const { data } = await apiClient.get<User>("/users/me");
    return cacheUser(data);
  } catch {
    return getCurrentUser();
  }
}

export async function loginUser(email: string, password: string): Promise<User> {
  const { data } = await apiClient.post<{ user: User; token: string }>("/auth/login", {
    email,
    password,
  });
  cacheToken(data.token);
  return cacheUser(data.user);
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const { data } = await apiClient.post<{ user: User; token: string }>("/auth/register", {
    name,
    email,
    password,
  });
  cacheToken(data.token);
  return cacheUser(data.user);
}

export async function updateUserProfile(
  updates: Pick<User, "name" | "email">
): Promise<User | null> {
  try {
    const { data } = await apiClient.patch<User>("/users/me", updates);
    return cacheUser(data);
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    removeStorageItem(STORAGE_KEYS.USER);
    removeStorageItem(STORAGE_KEYS.TOKEN);
  }
}

export function getUserSettings(): UserSettings {
  return getStorageItem(STORAGE_KEYS.SETTINGS, defaultSettings);
}

export async function fetchUserSettings(): Promise<UserSettings> {
  try {
    const { data } = await apiClient.get<UserSettings>("/users/me/settings");
    setStorageItem(STORAGE_KEYS.SETTINGS, data);
    return data;
  } catch {
    return getUserSettings();
  }
}

export async function updateNotificationPrefs(
  prefs: Partial<NotificationPreferences>
): Promise<UserSettings> {
  const { data } = await apiClient.patch<UserSettings>("/users/me/settings", {
    notifications: prefs,
  });
  setStorageItem(STORAGE_KEYS.SETTINGS, data);
  return data;
}
