interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanup(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number;
}

export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): RateLimitResult {
  cleanup();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxAttempts - 1, resetIn: windowMs };
  }

  entry.count++;

  if (entry.count > maxAttempts) {
    const resetIn = entry.resetAt - now;
    return { success: false, remaining: 0, resetIn };
  }

  return {
    success: true,
    remaining: maxAttempts - entry.count,
    resetIn: entry.resetAt - now,
  };
}

export function resetRateLimit(key: string): void {
  store.delete(key);
}
