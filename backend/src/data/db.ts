import Database from 'better-sqlite3'
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import path from 'path'
import * as schema from './schema'

const DEFAULT_DB_PATH = path.join(__dirname, '../../data.db')
const MIGRATIONS_PATH = path.join(__dirname, '../../drizzle')

export type AppDatabase = BetterSQLite3Database<typeof schema>

export interface DatabaseHandle {
  db: AppDatabase
  sqlite: Database.Database
}

export function createDatabase(dbPath: string = DEFAULT_DB_PATH): DatabaseHandle {
  const sqlite = new Database(dbPath)
  const db = drizzle(sqlite, { schema })
  migrate(db, { migrationsFolder: MIGRATIONS_PATH })
  return { db, sqlite }
}

let singleton: DatabaseHandle | null = null

export function getDb(): AppDatabase {
  if (!singleton) singleton = createDatabase()
  return singleton.db
}
