import fs from 'fs'
import path from 'path'
import { Quote } from './types'
import { normalizeText } from '../lib/text'

const QUOTES_PATH = path.join(__dirname, '../../../assets/quotes')
const CHARACTERS_PATH = path.join(__dirname, '../../../assets/characters.json')

// 1.1 — dictionnaire acteur -> personnage
const charactersDict: Record<string, string> = JSON.parse(
  fs.readFileSync(CHARACTERS_PATH, 'utf-8')
)

function resolveCharacter(actor: string): string | null {
  return charactersDict[actor] ?? null
}

// 1.2 — source de vérité pour le nom de livre (le JSON du format A ne le fournit pas)
const FILE_TO_BOOK: Record<string, string> = {
  livre_I: 'Livre I',
  livre_II: 'Livre II',
  livre_III: 'Livre III',
  livre_IV: 'Livre IV',
  livre_V: 'Livre V',
  livre_VI: 'Livre VI',
}

// 1.3 — détection de format
function detectFormat(raw: unknown): 'A' | 'B' {
  return Array.isArray(raw) ? 'B' : 'A'
}

// 1.4 — format A : objet { season, quotes_by_episodes: { "<num>": [...] } }
interface RawQuoteA {
  quote: string
  actor: string
  author: string
  title: string
}

interface RawFormatA {
  season: number
  quotes_by_episodes: Record<string, RawQuoteA[]>
}

function normalizeFormatA(raw: RawFormatA, bookName: string): Quote[] {
  const quotes: Quote[] = []

  for (const [episodeKey, episodeQuotes] of Object.entries(raw.quotes_by_episodes)) {
    const parsedNumber = Number(episodeKey)
    const episodeNumber = Number.isFinite(parsedNumber) ? parsedNumber : null

    for (const rawQuote of episodeQuotes) {
      const normalizedQuote: Quote = {
        book: bookName,
        episodeNumber: episodeNumber,
        episodeTitle: rawQuote.title,
        actor: rawQuote.actor,
        character: resolveCharacter(rawQuote.actor),
        author: rawQuote.author,
        quote: rawQuote.quote,
        quoteNormalized: normalizeText(rawQuote.quote),
      }
      quotes.push(normalizedQuote)
    }
  }

  return quotes
}

// 1.5 — format B : tableau plat avec champs en français
interface RawQuoteB {
  citation: string
  acteur: string
  auteur: string
  saison: string
  titre_episode: string
  num_episode: string
}

function normalizeFormatB(raw: RawQuoteB[]): Quote[] {
  return raw.map(item => ({
    book: item.saison,
    episodeNumber: Number(item.num_episode),
    episodeTitle: item.titre_episode,
    actor: item.acteur,
    character: resolveCharacter(item.acteur),
    author: item.auteur,
    quote: item.citation,
    quoteNormalized: normalizeText(item.citation),
  }))
}

// 1.6 — orchestrateur
export function loadAllQuotes(): Quote[] {
  const files = Object.keys(FILE_TO_BOOK)
  const allQuotes: Quote[] = []

  for (const file of files) {
    const filePath = path.join(QUOTES_PATH, `${file}.json`)
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    const quotes = detectFormat(raw) === 'A'
      ? normalizeFormatA(raw as RawFormatA, FILE_TO_BOOK[file])
      : normalizeFormatB(raw as RawQuoteB[])

    allQuotes.push(...quotes)
  }

  return allQuotes
}
