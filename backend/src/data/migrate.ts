import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import path from 'path'

const DB_PATH = path.join(__dirname, '../../data.db')
const MIGRATIONS_PATH = path.join(__dirname, '../../drizzle')

const sqlite = new Database(DB_PATH)
const db = drizzle(sqlite)

migrate(db, { migrationsFolder: MIGRATIONS_PATH })
sqlite.close()
console.log('Migrations appliquées ✓')
