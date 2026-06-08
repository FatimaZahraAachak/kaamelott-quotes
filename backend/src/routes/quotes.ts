import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { queryQuotes } from '../services/quotes'

const PAGE_SIZE_MAX = 100
const PAGE_SIZE_DEFAULT = 20

const querySchema = z.object({
  q: z.string().trim().default(''),
  character: z.string().trim().default(''),
  sort: z.enum(['book', 'episodeNumber']).default('book'),
  order: z.enum(['asc', 'desc']).default('asc'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(PAGE_SIZE_MAX).default(PAGE_SIZE_DEFAULT),
})

const router = Router()

router.get('/', (req: Request, res: Response) => {
  const parsed = querySchema.safeParse(req.query)
  if (!parsed.success) {
    res.status(400).json({ error: 'Paramètres invalides.', details: parsed.error.issues })
    return
  }
  res.json(queryQuotes(parsed.data))
})

export default router
