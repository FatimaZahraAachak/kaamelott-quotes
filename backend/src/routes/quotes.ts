import { Router, Request, Response } from 'express'
import { like, eq, and, asc, desc } from 'drizzle-orm'
import { getDb } from '../data/db'
import { quotes } from '../data/schema'
import { normalizeText } from '../lib/text'

const SORT_FIELDS = {
  book: [quotes.book],
  episodeNumber: [quotes.episodeNumber],
}

type SortKey = keyof typeof SORT_FIELDS

const router = Router()

router.get('/', (req: Request, res: Response) => {
  const db = getDb()
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  const character = typeof req.query.character === 'string' ? req.query.character.trim() : ''

  const sortParam = typeof req.query.sort === 'string' ? req.query.sort : 'book'
  const sortKey = (sortParam in SORT_FIELDS ? sortParam : 'book') as SortKey
  const direction = req.query.order === 'desc' ? desc : asc

  const query = db.select().from(quotes).$dynamic()
  const conditions = []

  if (q) {
    conditions.push(like(quotes.quoteNormalized, `%${normalizeText(q)}%`))
  }
  if (character) {
    conditions.push(eq(quotes.character, character))
  }

  if (conditions.length > 0) {
    query.where(and(...conditions))
  }

  const sortColumns = SORT_FIELDS[sortKey]
  query.orderBy(...sortColumns.map((col) => direction(col)))

  const results = query.all()
  res.json(results)
})

export default router
