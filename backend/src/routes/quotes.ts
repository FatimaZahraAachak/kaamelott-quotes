import { Router, Request, Response } from 'express'
import { getDb } from '../data/db'
import { quotes } from '../data/schema'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  const db = getDb()
  const allQuotes = db.select().from(quotes).all()
  res.json(allQuotes)
})

export default router
