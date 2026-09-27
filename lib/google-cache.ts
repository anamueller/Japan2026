const store = new Map<string, unknown>();

export function cacheKey(parts: unknown): string {
  return JSON.stringify(parts);
}

export function cacheGet<T>(key: string): T | undefined {
  return store.get(key) as T | undefined;
}

export function cacheSet<T>(key: string, value: T): T {
  store.set(key, value);
  return value;
}
