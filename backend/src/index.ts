import express from 'express'
import cors from 'cors'
import quotesRouter from './routes/quotes'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.use('/quotes', quotesRouter)

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
})
