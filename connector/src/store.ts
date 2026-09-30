import { encryptRecord, decryptRecord, assertOwnerShop, assertRecordPrefix, recordExpiry, MAX_SHOP_RECORDS, type RecordStore } from './record-store.js';
import { chmodSync, existsSync, lstatSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

/** Persistent encrypted records. Keys identify grants; credential payloads stay encrypted. */
export class SecretStore implements RecordStore {
  private db: DatabaseSync;
  private cleanupTimer?: ReturnType<typeof setInterval>;
  private closed = false;
  constructor(filename: string, private key: Buffer) {
    if (key.length !== 32) throw new Error('CONNECTOR_STORAGE_KEY must be a base64-encoded 32-byte key.');
    if (filename !== ':memory:') {
      mkdirSync(dirname(filename), { recursive: true, mode: 0o700 });
      if (existsSync(filename) && lstatSync(filename).isSymbolicLink()) throw new Error('Database must not be a symlink.');
    }
    this.db = new DatabaseSync(filename);
    if (filename !== ':memory:') chmodSync(filename, 0o600);
    try {
      this.db.exec('PRAGMA busy_timeout = 5000');
      this.transaction(() => {
        this.db.exec('CREATE TABLE IF NOT EXISTS records (key TEXT PRIMARY KEY, payload TEXT NOT NULL, expires INTEGER NOT NULL, owner_shop TEXT)');
        if (!this.db.prepare('PRAGMA table_info(records)').all().some(column => column.name === 'owner_shop')) {
          this.db.exec('ALTER TABLE records ADD COLUMN owner_shop TEXT');
        }
        this.db.exec('CREATE INDEX IF NOT EXISTS records_owner_shop ON records(owner_shop, key)');
        this.db.exec('CREATE INDEX IF NOT EXISTS records_expiry ON records(expires)');
      });
    } catch (error) { this.db.close(); throw error; }
  }
  private transaction<T>(callback: () => T): T {
    this.db.exec('BEGIN IMMEDIATE');
    try { const result = callback(); this.db.exec('COMMIT'); return result; }
    catch (error) { this.db.exec('ROLLBACK'); throw error; }
  }
  put(key: string, value: unknown, ttlSeconds: number, ownerShop?: string): void {
    if (ownerShop !== undefined) assertOwnerShop(ownerShop);
    const payload = encryptRecord(key, value, this.key);
    const expires = recordExpiry(ttlSeconds, Date.now());
    this.transaction(() => {
      this.db.prepare('INSERT OR REPLACE INTO records (key, payload, expires, owner_shop) VALUES (?, ?, ?, ?)').run(key, payload, expires, ownerShop ?? null);
      this.cleanup();
    });
  }
  get<T>(key: string): T | undefined {
    const row = this.db.prepare('SELECT payload FROM records WHERE key = ? AND expires > ?').get(key, Date.now());
    if (!row) return undefined;
    return decryptRecord<T>(key, row.payload as string, this.key);
  }
  take<T>(key: string): T | undefined {
    return this.transaction(() => { const value = this.get<T>(key); this.remove(key); return value; });
  }
  remove(key: string): void { this.db.prepare('DELETE FROM records WHERE key = ?').run(key); }
  removeByShop(shop: string): void {
    assertOwnerShop(shop);
    this.transaction(() => { this.db.prepare('DELETE FROM records WHERE owner_shop = ?').run(shop); });
  }
  listByShop<T>(shop: string, prefix: string): Array<{ key: string; value: T }> {
    assertOwnerShop(shop); assertRecordPrefix(prefix);
    const rows = this.db.prepare('SELECT key, payload FROM records WHERE owner_shop = ? AND expires > ? AND substr(key, 1, length(?)) = ? ORDER BY key LIMIT ?')
      .all(shop, Date.now(), prefix, prefix, MAX_SHOP_RECORDS + 1);
    if (rows.length > MAX_SHOP_RECORDS) throw new Error('Shop record listing exceeds its safety limit; narrow the prefix.');
    return rows.map(row => ({ key: row.key as string, value: decryptRecord<T>(row.key as string, row.payload as string, this.key) }));
  }
  cleanup(): void { this.db.prepare('DELETE FROM records WHERE expires <= ?').run(Date.now()); }
  /** Explicitly started by the HTTP process; an unref timer never keeps shutdown waiting. */
  startCleanup(intervalMs = 60_000): void {
    if (this.closed) throw new Error('Cannot start cleanup on a closed record store.');
    if (!Number.isSafeInteger(intervalMs) || intervalMs < 1 || intervalMs > 2_147_483_647) throw new Error('Invalid cleanup interval.');
    if (this.cleanupTimer) return;
    this.cleanup();
    this.cleanupTimer = setInterval(() => {
      try { this.cleanup(); }
      catch { console.error('Expired credential cleanup failed; it will retry.'); }
    }, intervalMs);
    this.cleanupTimer.unref();
  }
  close(): void {
    if (this.closed) return;
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
    this.cleanupTimer = undefined;
    this.db.close(); this.closed = true;
  }
}
