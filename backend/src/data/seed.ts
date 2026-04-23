import { createDatabase } from './db'
import { loadAllQuotes } from './loader'
import { quotes } from './schema'

function main(): void {
  const { db, sqlite } = createDatabase()
  const rows = loadAllQuotes()

  db.delete(quotes).run()

  sqlite.transaction(() => {
    for (const row of rows) {
      db.insert(quotes).values(row).run()
    }
  })()

  console.log(`✓ ${rows.length} citations insérées`)
  sqlite.close()
}

main()
