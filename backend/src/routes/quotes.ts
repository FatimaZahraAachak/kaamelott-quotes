import { Router, Request, Response } from 'express'
import { eq, and, asc, desc, sql, SQL } from 'drizzle-orm'
import { z } from 'zod'
import { getDb } from '../data/db'
import { quotes } from '../data/schema'
import { normalizeText } from '../lib/text'

const SORT_FIELDS = {
  book: [quotes.book],
  episodeNumber: [quotes.episodeNumber],
}


const PAGE_SIZE_DEFAULT = 20
const PAGE_SIZE_MAX = 100

const querySchema = z.object({
  q: z.string().trim().default(''),
  character: z.string().trim().default(''),
  sort: z.enum(['book', 'episodeNumber']).default('book'),
  order: z.enum(['asc', 'desc']).default('asc'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(PAGE_SIZE_MAX).default(PAGE_SIZE_DEFAULT),
})

function escapeLikePattern(input: string): string {
  return input.replace(/[\\%_]/g, '\\$&')
}

function countQuotes(db: ReturnType<typeof getDb>, conditions: SQL[]): number {
  const query = db.select({ count: sql<number>`count(*)` }).from(quotes).$dynamic()
  if (conditions.length > 0) {
    query.where(and(...conditions))
  }
  return query.get()?.count ?? 0
}

const router = Router()

router.get('/', (req: Request, res: Response) => {
  const parsed = querySchema.safeParse(req.query)
  if (!parsed.success) {
    res.status(400).json({ error: 'Paramètres invalides.', details: parsed.error.issues })
    return
  }

  const db = getDb()
  const { q, character, sort: sortKey, order, page, pageSize } = parsed.data
  const direction = order === 'desc' ? desc : asc

  const query = db.select().from(quotes).$dynamic()
  const conditions: SQL[] = []

  if (q) {
    const pattern = `%${escapeLikePattern(normalizeText(q))}%`
    conditions.push(sql`${quotes.quoteNormalized} LIKE ${pattern} ESCAPE '\\'`)
  }
  if (character) {
    conditions.push(eq(quotes.character, character))
  }

  if (conditions.length > 0) {
    query.where(and(...conditions))
  }

  const total = countQuotes(db, conditions)

  const sortColumns = SORT_FIELDS[sortKey]
  query.orderBy(...sortColumns.map((col) => direction(col)), asc(quotes.id))

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
