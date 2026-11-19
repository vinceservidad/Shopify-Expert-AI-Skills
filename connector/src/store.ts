import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { chmodSync, existsSync, lstatSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

/** Persistent encrypted records. Keys identify grants; credential payloads stay encrypted. */
export class SecretStore {
  private db: DatabaseSync;
  constructor(filename: string, private key: Buffer) {
    if (key.length !== 32) throw new Error('CONNECTOR_STORAGE_KEY must be a base64-encoded 32-byte key.');
    if (filename !== ':memory:') {
      mkdirSync(dirname(filename), { recursive: true, mode: 0o700 });
      if (existsSync(filename) && lstatSync(filename).isSymbolicLink()) throw new Error('Database must not be a symlink.');
    }
    this.db = new DatabaseSync(filename);
    if (filename !== ':memory:') chmodSync(filename, 0o600);
    this.db.exec('CREATE TABLE IF NOT EXISTS records (key TEXT PRIMARY KEY, payload TEXT NOT NULL, expires INTEGER NOT NULL)');
  }
  put(key: string, value: unknown, ttlSeconds: number): void {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    cipher.setAAD(Buffer.from(key));
    const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
    const payload = Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64');
    this.db.prepare('INSERT OR REPLACE INTO records VALUES (?, ?, ?)').run(key, payload, Date.now() + ttlSeconds * 1000);
    this.db.prepare('DELETE FROM records WHERE expires < ?').run(Date.now());
  }
  get<T>(key: string): T | undefined {
    const row = this.db.prepare('SELECT payload FROM records WHERE key = ? AND expires >= ?').get(key, Date.now());
    if (!row) return undefined;
    const payload = Buffer.from(row.payload as string, 'base64');
    const decipher = createDecipheriv('aes-256-gcm', this.key, payload.subarray(0, 12));
    decipher.setAAD(Buffer.from(key));
    decipher.setAuthTag(payload.subarray(12, 28));
    return JSON.parse(Buffer.concat([decipher.update(payload.subarray(28)), decipher.final()]).toString('utf8')) as T;
  }
  take<T>(key: string): T | undefined {
    const value = this.get<T>(key);
    this.remove(key);
    return value;
  }
  remove(key: string): void { this.db.prepare('DELETE FROM records WHERE key = ?').run(key); }
  close(): void { this.db.close(); }
}
