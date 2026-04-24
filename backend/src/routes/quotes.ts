import { Router, Request, Response } from 'express'
import { like, eq, and, asc, desc, sql, SQL } from 'drizzle-orm'
import { getDb } from '../data/db'
import { quotes } from '../data/schema'
import { normalizeText } from '../lib/text'

const SORT_FIELDS = {
  book: [quotes.book],
  episodeNumber: [quotes.episodeNumber],
}

type SortKey = keyof typeof SORT_FIELDS

const PAGE_SIZE_DEFAULT = 20
const PAGE_SIZE_MAX = 100

function countQuotes(db: ReturnType<typeof getDb>, conditions: SQL[]): number {
  const query = db.select({ count: sql<number>`count(*)` }).from(quotes).$dynamic()
  if (conditions.length > 0) {
    query.where(and(...conditions))
  }
  return query.get()?.count ?? 0
}

const router = Router()

router.get('/', (req: Request, res: Response) => {
  const db = getDb()
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  const character = typeof req.query.character === 'string' ? req.query.character.trim() : ''

  const sortParam = typeof req.query.sort === 'string' ? req.query.sort : 'book'
  const sortKey = (sortParam in SORT_FIELDS ? sortParam : 'book') as SortKey
  const direction = req.query.order === 'desc' ? desc : asc

  const pageParam = Number(req.query.page)
  const page = Number.isInteger(pageParam) && pageParam >= 1 ? pageParam : 1

  const pageSizeParam = Number(req.query.pageSize)
  const pageSize =
    Number.isInteger(pageSizeParam) && pageSizeParam >= 1
      ? Math.min(pageSizeParam, PAGE_SIZE_MAX)
      : PAGE_SIZE_DEFAULT

  const query = db.select().from(quotes).$dynamic()
  const conditions: SQL[] = []

  if (q) {
    conditions.push(like(quotes.quoteNormalized, `%${normalizeText(q)}%`))
  }
  if (character) {
    conditions.push(eq(quotes.character, character))
  }

  if (conditions.length > 0) {
    query.where(and(...conditions))
  }

  const total = countQuotes(db, conditions)

  const sortColumns = SORT_FIELDS[sortKey]
  query.orderBy(...sortColumns.map((col) => direction(col)))

  const offset = (page - 1) * pageSize
  query.limit(pageSize).offset(offset)

  const results = query.all()
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize)

  res.json({
    data: results,
    page,
    pageSize,
    total,
    totalPages,
  })
})

export default router
