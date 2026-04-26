import { Router, Request, Response } from 'express'
import { and, isNotNull, ne, asc } from 'drizzle-orm'
import { getDb } from '../data/db'
import { quotes } from '../data/schema'

const router = Router()

router.get('/', (_req: Request, res: Response) => {
  const db = getDb()

  const rows = db
    .selectDistinct({ character: quotes.character })
    .from(quotes)
    .where(and(isNotNull(quotes.character), ne(quotes.character, '')))
    .orderBy(asc(quotes.character))
    .all()

  const data = rows
    .map((r) => r.character)
    .filter((c): c is string => c !== null)

  res.json({ data })
})

export default router
