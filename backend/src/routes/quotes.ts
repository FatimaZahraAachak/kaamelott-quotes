import { Router, Request, Response } from 'express'
import { like } from 'drizzle-orm'
import { getDb } from '../data/db'
import { quotes } from '../data/schema'
import { normalizeText } from '../lib/text'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  const db = getDb()
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''

  const query = db.select().from(quotes).$dynamic()

  if (q) {
    query.where(like(quotes.quoteNormalized, `%${normalizeText(q)}%`))
  }

  const results = query.all()
  res.json(results)
})

export default router
