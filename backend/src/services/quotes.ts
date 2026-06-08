import { eq, and, asc, desc, sql, SQL } from 'drizzle-orm'
import { getDb } from '../data/db'
import { quotes } from '../data/schema'
import { normalizeText } from '../lib/text'

const SORT_COLUMNS = {
  book: quotes.book,
  episodeNumber: quotes.episodeNumber,
} as const

export type SortKey = keyof typeof SORT_COLUMNS

export type QuoteQuery = {
  q: string
  character: string
  sort: SortKey
  order: 'asc' | 'desc'
  page: number
  pageSize: number
}

export type QuotesResult = {
  data: (typeof quotes.$inferSelect)[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

function escapeLike(input: string): string {
  return input.replace(/[\\%_]/g, '\\$&')
}

function buildConditions(q: string, character: string): SQL[] {
  const conditions: SQL[] = []
  if (q) {
    const pattern = `%${escapeLike(normalizeText(q))}%`
    conditions.push(sql`${quotes.quoteNormalized} LIKE ${pattern} ESCAPE '\\'`)
  }
  if (character) {
    conditions.push(eq(quotes.character, character))
  }
  return conditions
}

function countRows(conditions: SQL[]): number {
  const db = getDb()
  const query = db.select({ count: sql<number>`count(*)` }).from(quotes).$dynamic()
  if (conditions.length > 0) query.where(and(...conditions))
  return query.get()?.count ?? 0
}

export function queryQuotes(params: QuoteQuery): QuotesResult {
  const db = getDb()
  const { q, character, sort, order, page, pageSize } = params
  const direction = order === 'desc' ? desc : asc
  const conditions = buildConditions(q, character)

  const query = db.select().from(quotes).$dynamic()
  if (conditions.length > 0) query.where(and(...conditions))

  const total = countRows(conditions)

  query.orderBy(direction(SORT_COLUMNS[sort]), asc(quotes.id))
  query.limit(pageSize).offset((page - 1) * pageSize)

  return {
    data: query.all(),
    page,
    pageSize,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
  }
}
