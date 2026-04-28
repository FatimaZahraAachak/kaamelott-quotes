import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import { createTestDb, seedQuotes, TestDb } from '../test/helpers'

let testDb: TestDb

vi.mock('../data/db', () => ({
  getDb: () => testDb,
}))

async function buildApp() {
  const { createApp } = await import('../index')
  return createApp()
}

beforeEach(() => {
  testDb = createTestDb()
})

describe('GET /characters', () => {
  it('returns the distinct list of characters, alphabetically sorted', async () => {
    seedQuotes(testDb, [
      { book: 'L', episodeTitle: 'E', actor: 'A1', character: 'Perceval',
        author: 'A', quote: 'q', quoteNormalized: 'q' },
      { book: 'L', episodeTitle: 'E', actor: 'A2', character: 'Arthur',
        author: 'A', quote: 'q', quoteNormalized: 'q' },
      { book: 'L', episodeTitle: 'E', actor: 'A3', character: 'Arthur',
        author: 'A', quote: 'q', quoteNormalized: 'q' },
    ])
    const app = await buildApp()
    const res = await request(app).get('/characters')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ data: ['Arthur', 'Perceval'] })
  })

  it('excludes null characters', async () => {
    seedQuotes(testDb, [
      { book: 'L', episodeTitle: 'E', actor: 'A1', character: 'Arthur',
        author: 'A', quote: 'q', quoteNormalized: 'q' },
      { book: 'L', episodeTitle: 'E', actor: 'A2', character: null,
        author: 'A', quote: 'q', quoteNormalized: 'q' },
    ])
    const app = await buildApp()
    const res = await request(app).get('/characters')
    expect(res.body.data).toEqual(['Arthur'])
  })

  it('excludes empty strings', async () => {
    seedQuotes(testDb, [
      { book: 'L', episodeTitle: 'E', actor: 'A1', character: 'Arthur',
        author: 'A', quote: 'q', quoteNormalized: 'q' },
      { book: 'L', episodeTitle: 'E', actor: 'A2', character: '',
        author: 'A', quote: 'q', quoteNormalized: 'q' },
    ])
    const app = await buildApp()
    const res = await request(app).get('/characters')
    expect(res.body.data).toEqual(['Arthur'])
  })

  it('returns an empty array when the table is empty', async () => {
    const app = await buildApp()
    const res = await request(app).get('/characters')
    expect(res.body).toEqual({ data: [] })
  })
})
