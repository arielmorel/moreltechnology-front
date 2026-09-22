import axios from "axios";
import { Setting } from "./types";

const SETTINGS_BASE = "/api/settings";
const SETTINGS_CACHE_TTL_MS = 5 * 60 * 1000;
const SETTINGS_CACHE_KEY = "mt-settings-cache";

type CachedSetting = { value: Setting | null; timestamp: number };

function readSettingsCache(): Record<string, CachedSetting> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(SETTINGS_CACHE_KEY);
    return raw ? JSON.parse(raw) as Record<string, CachedSetting> : {};
  } catch {
    return {};
  }
}

function writeSettingsCache(cache: Record<string, CachedSetting>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore quota/unavailable storage errors
  }
}

function bustSettingsCache(key?: string): void {
  const cache = readSettingsCache();
  if (key) {
    delete cache[key];
  } else {
    Object.keys(cache).forEach(k => delete cache[k]);
  }
  writeSettingsCache(cache);
}

export const getSettingByKey = async (key: string): Promise<Setting | null> => {
  const cache = readSettingsCache();
  const hit = cache[key];
  if (hit && Date.now() - hit.timestamp < SETTINGS_CACHE_TTL_MS) {
    return hit.value;
  }
  try {
    const response = await axios.get(`${SETTINGS_BASE}/${key}`);
    const setting = response.data;
    writeSettingsCache({ ...cache, [key]: { value: setting, timestamp: Date.now() } });
    return setting;
  } catch {
    return null;
  }
};

export const getSettingWithDefault = async (key: string, defaultValue: string): Promise<string> => {
  const setting = await getSettingByKey(key);
  return setting?.value ?? defaultValue;
};

export const getSettingsByCategory = async (category: Setting["category"]): Promise<Setting[]> => {
  try {
    const response = await axios.get(`${SETTINGS_BASE}/category/${category}`);
    return response.data;
  } catch {
    return [];
  }
};

export const saveSetting = async (key: string, value: string, type: Setting["type"] = "STRING", category: Setting["category"] = "GENERAL"): Promise<Setting> => {
  const response = await axios.patch(`${SETTINGS_BASE}/${key}`, { value, type, category });
  bustSettingsCache(key);
  return response.data;
};