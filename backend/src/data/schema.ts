import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core'

export const quotes = sqliteTable(
  'quotes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    book: text('book').notNull(),
    episodeNumber: integer('episode_number'),
    episodeTitle: text('episode_title').notNull(),
    actor: text('actor').notNull(),
    character: text('character'),
    author: text('author').notNull(),
    quote: text('quote').notNull(),
    quoteNormalized: text('quote_normalized').notNull(),
  },
  (table) => ({
    actorIdx: index('idx_quotes_actor').on(table.actor),
    bookIdx: index('idx_quotes_book').on(table.book),
    quoteNormalizedIdx: index('idx_quotes_quote_normalized').on(table.quoteNormalized),
  })
)

export type QuoteRow = typeof quotes.$inferSelect
export type QuoteInsert = typeof quotes.$inferInsert
