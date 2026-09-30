import { encryptRecord, decryptRecord, type RecordStore } from '../src/record-store.js';

/** One issuer's strongly consistent OAuth records; secrets remain encrypted in SQLite. */
export class DurableSecretStore implements RecordStore {
  constructor(private storage: DurableObjectStorage, private key: Buffer) {
    if (key.length !== 32) throw new Error('Invalid storage encryption key.');
    storage.sql.exec('CREATE TABLE IF NOT EXISTS records (key TEXT PRIMARY KEY, payload TEXT NOT NULL, expires INTEGER NOT NULL)');
  }
  put(key: string, value: unknown, ttl: number): void {
    this.storage.transactionSync(() => {
      this.storage.sql.exec('INSERT OR REPLACE INTO records VALUES (?, ?, ?)', key, encryptRecord(key, value, this.key), Date.now() + ttl * 1000);
      this.storage.sql.exec('DELETE FROM records WHERE expires < ?', Date.now());
    });
  }
  get<T>(key: string): T | undefined {
    const row = this.storage.sql.exec<{ payload: string }>('SELECT payload FROM records WHERE key = ? AND expires >= ?', key, Date.now()).toArray()[0];
    return row ? decryptRecord<T>(key, row.payload, this.key) : undefined;
  }
  take<T>(key: string): T | undefined {
    return this.storage.transactionSync(() => { const value = this.get<T>(key); this.remove(key); return value; });
  }
  remove(key: string): void { this.storage.sql.exec('DELETE FROM records WHERE key = ?', key); }
  cleanup(): void { this.storage.sql.exec('DELETE FROM records WHERE expires < ?', Date.now()); }
}
