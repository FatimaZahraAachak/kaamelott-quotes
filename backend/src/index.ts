import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import quotesRouter from './routes/quotes'
import charactersRouter from './routes/characters'
import { getDb } from './data/db'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.use('/quotes', quotesRouter)
  app.use('/characters', charactersRouter)

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[error]', err)
    res.status(500).json({ error: 'Internal server error' })
  })

  return app
}

const PORT = 3000

if (require.main === module) {
  try {
    getDb()
  } catch (err) {
    console.error('[fatal] Cannot initialize database:', err)
    process.exit(1)
  }

  const app = createApp()
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`)
  })
}
