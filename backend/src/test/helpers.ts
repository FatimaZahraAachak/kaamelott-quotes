import path from 'path'
import Database from 'better-sqlite3'
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from '../data/schema'
import { quotes, QuoteInsert } from '../data/schema'

export type TestDb = BetterSQLite3Database<typeof schema>

const MIGRATIONS_PATH = path.join(__dirname, '../../drizzle')

export function createTestDb(): TestDb {
  const sqlite = new Database(':memory:')
  const db = drizzle(sqlite, { schema })
  migrate(db, { migrationsFolder: MIGRATIONS_PATH })
  return db
}

export function seedQuotes(db: TestDb, rows: QuoteInsert[]): void {
  db.insert(quotes).values(rows).run()
}
