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

const sample = [
  {
    book: 'Livre I',
    episodeNumber: 1,
    episodeTitle: 'Heat',
    actor: 'Alexandre Astier',
    character: 'Arthur',
    author: 'Astier',
    quote: "C'est pas faux.",
    quoteNormalized: "c'est pas faux.",
  },
  {
    book: 'Livre I',
    episodeNumber: 2,
    episodeTitle: 'Le Chevalier mystère',
    actor: 'Franck Pitiot',
    character: 'Perceval',
    author: 'Astier',
    quote: 'On en a gros.',
    quoteNormalized: 'on en a gros.',
  },
  {
    book: 'Livre II',
    episodeNumber: 1,
    episodeTitle: 'Évreux',
    actor: 'Alexandre Astier',
    character: 'Arthur',
    author: 'Astier',
    quote: 'Bonjour Évreux.',
    quoteNormalized: 'bonjour evreux.',
  },
]

beforeEach(() => {
  testDb = createTestDb()
  seedQuotes(testDb, sample)
})

describe('GET /quotes', () => {
  it('returns all quotes with default pagination', async () => {
    const app = await buildApp()
    const res = await request(app).get('/quotes')
    expect(res.status).toBe(200)
    expect(res.body.total).toBe(3)
    expect(res.body.page).toBe(1)
    expect(res.body.pageSize).toBe(20)
    expect(res.body.totalPages).toBe(1)
    expect(res.body.data).toHaveLength(3)
  })

  it('sorts by book ascending by default', async () => {
    const app = await buildApp()
    const res = await request(app).get('/quotes')
    const books = res.body.data.map((q: { book: string }) => q.book)
    expect(books).toEqual(['Livre I', 'Livre I', 'Livre II'])
  })

  it('sorts by book descending when order=desc', async () => {
    const app = await buildApp()
    const res = await request(app).get('/quotes?order=desc')
    const books = res.body.data.map((q: { book: string }) => q.book)
    expect(books).toEqual(['Livre II', 'Livre I', 'Livre I'])
  })

  it('sorts by episodeNumber when sort=episodeNumber', async () => {
    const app = await buildApp()
    const res = await request(app).get('/quotes?sort=episodeNumber&order=asc')
    const eps = res.body.data.map(
      (q: { episodeNumber: number }) => q.episodeNumber,
    )
    expect(eps).toEqual([1, 1, 2])
  })

  it('falls back to sort=book when the sort key is invalid', async () => {
    const app = await buildApp()
    const res = await request(app).get('/quotes?sort=hackedField')
    expect(res.status).toBe(200)
    const books = res.body.data.map((q: { book: string }) => q.book)
    expect(books).toEqual(['Livre I', 'Livre I', 'Livre II'])
  })

  it('filters by q (case-insensitive and accent-insensitive)', async () => {
    const app = await buildApp()
    const res = await request(app).get('/quotes?q=ÉVREUX')
    expect(res.body.total).toBe(1)
    expect(res.body.data[0].quote).toBe('Bonjour Évreux.')
  })

  it('filters by character', async () => {
    const app = await buildApp()
    const res = await request(app).get('/quotes?character=Perceval')
    expect(res.body.total).toBe(1)
    expect(res.body.data[0].character).toBe('Perceval')
  })

  it('combines q and character filters', async () => {
    const app = await buildApp()
    const res = await request(app).get('/quotes?q=evreux&character=Arthur')
    expect(res.body.total).toBe(1)
    expect(res.body.data[0].quote).toBe('Bonjour Évreux.')
  })

  it('returns empty data and totalPages=0 when no result matches', async () => {
    const app = await buildApp()
    const res = await request(app).get('/quotes?q=zzznoresult')
    expect(res.body.total).toBe(0)
    expect(res.body.totalPages).toBe(0)
    expect(res.body.data).toEqual([])
  })

  it('respects pageSize and page parameters', async () => {
    const app = await buildApp()
    const res = await request(app).get('/quotes?pageSize=2&page=2')
    expect(res.body.page).toBe(2)
    expect(res.body.pageSize).toBe(2)
    expect(res.body.totalPages).toBe(2)
    expect(res.body.data).toHaveLength(1)
  })

  it('clamps pageSize to PAGE_SIZE_MAX (100)', async () => {
    const app = await buildApp()
    const res = await request(app).get('/quotes?pageSize=999')
    expect(res.body.pageSize).toBe(100)
  })

  it('falls back to pageSize=20 when pageSize is invalid', async () => {
    const app = await buildApp()
    const res = await request(app).get('/quotes?pageSize=abc')
    expect(res.body.pageSize).toBe(20)
  })

  it('falls back to page=1 when page is invalid or < 1', async () => {
    const app = await buildApp()
    const res = await request(app).get('/quotes?page=0')
    expect(res.body.page).toBe(1)
  })
})

describe('error handling', () => {
  it('returns 500 JSON when the database throws', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    testDb = {
      select: () => {
        throw new Error('boom')
      },
    } as unknown as TestDb

    const app = await buildApp()
    const res = await request(app).get('/quotes')

    expect(res.status).toBe(500)
    expect(res.body).toEqual({ error: 'Internal server error' })
    expect(res.headers['content-type']).toMatch(/json/)

    errorSpy.mockRestore()
  })
})
