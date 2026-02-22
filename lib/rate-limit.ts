const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

const store = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const current = store.get(key);

  if (!current || now > current.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (current.count >= MAX_REQUESTS) return true;

  current.count += 1;
  store.set(key, current);
  return false;
}
