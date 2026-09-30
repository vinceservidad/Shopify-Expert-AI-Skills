import { encryptRecord, decryptRecord, type RecordStore } from './record-store.js';
import { chmodSync, existsSync, lstatSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

/** Persistent encrypted records. Keys identify grants; credential payloads stay encrypted. */
export class SecretStore implements RecordStore {
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
    const payload = encryptRecord(key, value, this.key);
    this.db.prepare('INSERT OR REPLACE INTO records VALUES (?, ?, ?)').run(key, payload, Date.now() + ttlSeconds * 1000);
    this.db.prepare('DELETE FROM records WHERE expires < ?').run(Date.now());
  }
  get<T>(key: string): T | undefined {
    const row = this.db.prepare('SELECT payload FROM records WHERE key = ? AND expires >= ?').get(key, Date.now());
    if (!row) return undefined;
    return decryptRecord<T>(key, row.payload as string, this.key);
  }
  take<T>(key: string): T | undefined {
    const value = this.get<T>(key);
    this.remove(key);
    return value;
  }
  remove(key: string): void { this.db.prepare('DELETE FROM records WHERE key = ?').run(key); }
  close(): void { this.db.close(); }
}
