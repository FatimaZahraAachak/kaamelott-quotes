import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchQuotes } from './quotes'

beforeEach(() => {
  vi.stubEnv('VITE_API_URL', 'http://api.test')
  vi.restoreAllMocks()
})

function mockFetchOk(body: unknown) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => body,
  } as Response)
}

const emptyResponse = {
  data: [],
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
}

describe('fetchQuotes', () => {
  it('always includes pageSize=20 and page in the URL', async () => {
    const spy = mockFetchOk(emptyResponse)
    await fetchQuotes({
      search: '',
      character: '',
      sort: '',
      order: 'asc',
      page: 3,
    })
    const url = new URL(spy.mock.calls[0][0] as string)
    expect(url.searchParams.get('pageSize')).toBe('20')
    expect(url.searchParams.get('page')).toBe('3')
  })

  it('omits q, character and sort when empty', async () => {
    const spy = mockFetchOk(emptyResponse)
    await fetchQuotes({
      search: '',
      character: '',
      sort: '',
      order: 'asc',
      page: 1,
    })
    const url = new URL(spy.mock.calls[0][0] as string)
    expect(url.searchParams.has('q')).toBe(false)
    expect(url.searchParams.has('character')).toBe(false)
    expect(url.searchParams.has('sort')).toBe(false)
  })

  it('adds optional params when provided', async () => {
    const spy = mockFetchOk(emptyResponse)
    await fetchQuotes({
      search: 'cthon',
      character: 'Arthur',
      sort: 'book',
      order: 'desc',
      page: 1,
    })
    const url = new URL(spy.mock.calls[0][0] as string)
    expect(url.searchParams.get('q')).toBe('cthon')
    expect(url.searchParams.get('character')).toBe('Arthur')
    expect(url.searchParams.get('sort')).toBe('book')
    expect(url.searchParams.get('order')).toBe('desc')
  })

  it('throws a server error message when the response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)
    await expect(
      fetchQuotes({
        search: '',
        character: '',
        sort: '',
        order: 'asc',
        page: 1,
      }),
    ).rejects.toThrow('Erreur serveur. Réessaie plus tard.')
  })

  it('returns the parsed JSON on success', async () => {
    const body = {
      data: [
        {
          id: 1,
          book: 'Livre I',
          episodeNumber: 1,
          episodeTitle: 'Ep',
          actor: 'A',
          character: 'Arthur',
          author: 'A',
          quote: 'q',
          quoteNormalized: 'q',
        },
      ],
      page: 1,
      pageSize: 20,
      total: 1,
      totalPages: 1,
    }
    mockFetchOk(body)
    const result = await fetchQuotes({
      search: '',
      character: '',
      sort: '',
      order: 'asc',
      page: 1,
    })
    expect(result).toEqual(body)
  })
})
