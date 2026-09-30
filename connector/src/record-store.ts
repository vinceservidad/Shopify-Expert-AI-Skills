import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

export interface RecordStore {
  put(key: string, value: unknown, ttlSeconds: number, ownerShop?: string): void;
  get<T>(key: string): T | undefined;
  take<T>(key: string): T | undefined;
  remove(key: string): void;
  /** Deletes every record owned by exactly this shop in one transaction. */
  removeByShop(shop: string): void;
  /** Live records only. Throws rather than returning an incomplete oversized result. */
  listByShop<T>(shop: string, prefix: string): Array<{ key: string; value: T }>;
  cleanup(): void;
}

export const MAX_SHOP_RECORDS = 1000;

export function assertOwnerShop(shop: string): void {
  if (typeof shop !== 'string' || shop.length > 255 || !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop)) {
    throw new Error('Record ownership requires a canonical myshopify.com domain.');
  }
}

export function assertRecordPrefix(prefix: string): void {
  if (typeof prefix !== 'string' || prefix.length > 512 || prefix.includes('\0')) throw new Error('Invalid record prefix.');
}

export function recordExpiry(ttlSeconds: number, now: number): number {
  const expires = Math.floor(now + ttlSeconds * 1000);
  if (!Number.isFinite(ttlSeconds) || !Number.isSafeInteger(expires)) throw new Error('Invalid record lifetime.');
  return expires;
}

export function encryptRecord(name: string, value: unknown, key: Buffer): string {
  if (key.length !== 32) throw new Error('Storage encryption requires a 32-byte key.');
  const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(name));
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64');
}

export function decryptRecord<T>(name: string, encoded: string, key: Buffer): T {
  const payload = Buffer.from(encoded, 'base64');
  const decipher = createDecipheriv('aes-256-gcm', key, payload.subarray(0, 12));
  decipher.setAAD(Buffer.from(name));
  decipher.setAuthTag(payload.subarray(12, 28));
  return JSON.parse(Buffer.concat([decipher.update(payload.subarray(28)), decipher.final()]).toString('utf8')) as T;
}
