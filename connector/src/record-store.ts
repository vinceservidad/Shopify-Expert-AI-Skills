import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

export interface RecordStore {
  put(key: string, value: unknown, ttlSeconds: number): void;
  get<T>(key: string): T | undefined;
  take<T>(key: string): T | undefined;
  remove(key: string): void;
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
