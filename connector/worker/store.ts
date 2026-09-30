import { encryptRecord, decryptRecord, assertOwnerShop, assertRecordPrefix, recordExpiry, MAX_SHOP_RECORDS, type RecordStore } from '../src/record-store.js';

/** One issuer's strongly consistent OAuth records; secrets remain encrypted in SQLite. */
export class DurableSecretStore implements RecordStore {
  constructor(private storage: DurableObjectStorage, private key: Buffer) {
    if (key.length !== 32) throw new Error('Invalid storage encryption key.');
    storage.transactionSync(() => {
      storage.sql.exec('CREATE TABLE IF NOT EXISTS records (key TEXT PRIMARY KEY, payload TEXT NOT NULL, expires INTEGER NOT NULL, owner_shop TEXT)');
      if (!storage.sql.exec<{ name: string }>('PRAGMA table_info(records)').toArray().some(column => column.name === 'owner_shop')) {
        storage.sql.exec('ALTER TABLE records ADD COLUMN owner_shop TEXT');
      }
      storage.sql.exec('CREATE INDEX IF NOT EXISTS records_owner_shop ON records(owner_shop, key)');
      storage.sql.exec('CREATE INDEX IF NOT EXISTS records_expiry ON records(expires)');
    });
  }
  put(key: string, value: unknown, ttl: number, ownerShop?: string): void {
    if (ownerShop !== undefined) assertOwnerShop(ownerShop);
    const payload = encryptRecord(key, value, this.key), expires = recordExpiry(ttl, Date.now());
    this.storage.transactionSync(() => {
      this.storage.sql.exec('INSERT OR REPLACE INTO records (key, payload, expires, owner_shop) VALUES (?, ?, ?, ?)', key, payload, expires, ownerShop ?? null);
      this.cleanup();
    });
  }
  get<T>(key: string): T | undefined {
    const row = this.storage.sql.exec<{ payload: string }>('SELECT payload FROM records WHERE key = ? AND expires > ?', key, Date.now()).toArray()[0];
    return row ? decryptRecord<T>(key, row.payload, this.key) : undefined;
  }
  take<T>(key: string): T | undefined {
    return this.storage.transactionSync(() => { const value = this.get<T>(key); this.remove(key); return value; });
  }
  remove(key: string): void { this.storage.sql.exec('DELETE FROM records WHERE key = ?', key); }
  removeByShop(shop: string): void {
    assertOwnerShop(shop);
    this.storage.transactionSync(() => { this.storage.sql.exec('DELETE FROM records WHERE owner_shop = ?', shop); });
  }
  listByShop<T>(shop: string, prefix: string): Array<{ key: string; value: T }> {
    assertOwnerShop(shop); assertRecordPrefix(prefix);
    const rows = this.storage.sql.exec<{ key: string; payload: string }>(
      'SELECT key, payload FROM records WHERE owner_shop = ? AND expires > ? AND substr(key, 1, length(?)) = ? ORDER BY key LIMIT ?',
      shop, Date.now(), prefix, prefix, MAX_SHOP_RECORDS + 1).toArray();
    if (rows.length > MAX_SHOP_RECORDS) throw new Error('Shop record listing exceeds its safety limit; narrow the prefix.');
    return rows.map(row => ({ key: row.key, value: decryptRecord<T>(row.key, row.payload, this.key) }));
  }
  cleanup(): void { this.storage.sql.exec('DELETE FROM records WHERE expires <= ?', Date.now()); }
}
