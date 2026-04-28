import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode, RefObject } from 'react'
import { QuoteList } from './QuoteList'
import * as api from '../api/quotes'

let lastIntersect: (() => void) | null = null

vi.mock('../hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: (
    _ref: RefObject<Element>,
    opts: { enabled: boolean; onIntersect: () => void },
  ) => {
    lastIntersect = opts.enabled ? opts.onIntersect : null
  },
}))

function wrap(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  )
}

const baseProps = {
  search: '',
  character: '',
  sort: 'book',
  order: 'asc' as const,
}

beforeEach(() => {
  lastIntersect = null
  vi.restoreAllMocks()
})

describe('QuoteList', () => {
  it('renders the loading message during initial fetch', () => {
    vi.spyOn(api, 'fetchQuotes').mockImplementation(
      () => new Promise(() => {}),
    )
    wrap(<QuoteList {...baseProps} />)
    expect(screen.getByText('Chargement...')).toBeInTheDocument()
  })

  it('renders the error message and retry button when fetchQuotes fails', async () => {
    vi.spyOn(api, 'fetchQuotes').mockRejectedValue(
      new Error('Le serveur est injoignable.'),
    )
    wrap(<QuoteList {...baseProps} />)
    expect(
      await screen.findByText('Le serveur est injoignable.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Réessayer/i }),
    ).toBeInTheDocument()
  })

  it('renders the empty state when no results and no search', async () => {
    vi.spyOn(api, 'fetchQuotes').mockResolvedValue({
      data: [],
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0,
    })
    wrap(<QuoteList {...baseProps} />)
    expect(await screen.findByText('Aucune citation.')).toBeInTheDocument()
  })

  it('renders the no-search-results message when search has no match', async () => {
    vi.spyOn(api, 'fetchQuotes').mockResolvedValue({
      data: [],
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0,
    })
    wrap(<QuoteList {...baseProps} search="xyz" />)
    expect(
      await screen.findByText(/Aucun résultat pour « xyz »\./),
    ).toBeInTheDocument()
  })

  it('renders the quotes with the plural total', async () => {
    vi.spyOn(api, 'fetchQuotes').mockResolvedValue({
      data: [
        {
          id: 1,
          book: 'Livre I',
          episodeNumber: 2,
          episodeTitle: 'Le Chevalier mystère',
          actor: 'A',
          character: 'Arthur',
          author: 'A',
          quote: "C'est pas faux.",
          quoteNormalized: '',
        },
        {
          id: 2,
          book: 'Livre I',
          episodeNumber: 3,
          episodeTitle: 'Trois cent soixante',
          actor: 'A',
          character: 'Perceval',
          author: 'A',
          quote: 'On en a gros.',
          quoteNormalized: '',
        },
      ],
      page: 1,
      pageSize: 20,
      total: 2,
      totalPages: 1,
    })
    wrap(<QuoteList {...baseProps} />)
    expect(await screen.findByText(/C'est pas faux\./)).toBeInTheDocument()
    expect(screen.getByText(/On en a gros\./)).toBeInTheDocument()
    expect(screen.getByText('2 résultats')).toBeInTheDocument()
    expect(screen.getByText(/fin des résultats/)).toBeInTheDocument()
  })

  it('uses the singular "résultat" when total = 1', async () => {
    vi.spyOn(api, 'fetchQuotes').mockResolvedValue({
      data: [
        {
          id: 1,
          book: 'L',
          episodeNumber: 1,
          episodeTitle: 'E',
          actor: 'A',
          character: 'C',
          author: 'A',
          quote: 'q',
          quoteNormalized: '',
        },
      ],
      page: 1,
      pageSize: 20,
      total: 1,
      totalPages: 1,
    })
    wrap(<QuoteList {...baseProps} />)
    await waitFor(() =>
      expect(screen.getByText('1 résultat')).toBeInTheDocument(),
    )
  })

  it('recovers from an initial fetch error after clicking Réessayer', async () => {
    const spy = vi
      .spyOn(api, 'fetchQuotes')
      .mockRejectedValueOnce(new Error('Le serveur est injoignable.'))
    wrap(<QuoteList {...baseProps} />)

    const retryButton = await screen.findByRole('button', { name: /Réessayer/i })

    spy.mockResolvedValueOnce({
      data: [],
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0,
    })
    await userEvent.click(retryButton)
    expect(await screen.findByText('Aucune citation.')).toBeInTheDocument()
  })

  it('shows a retry button when fetching the next page fails', async () => {
    const firstPageQuote = {
      id: 1,
      book: 'L',
      episodeNumber: 1,
      episodeTitle: 'E',
      actor: 'A',
      character: 'Arthur',
      author: 'A',
      quote: 'page-1-quote',
      quoteNormalized: '',
    }
    const spy = vi
      .spyOn(api, 'fetchQuotes')
      .mockResolvedValueOnce({
        data: [firstPageQuote],
        page: 1,
        pageSize: 1,
        total: 2,
        totalPages: 2,
      })
      .mockRejectedValueOnce(new Error('Erreur serveur. Réessaie plus tard.'))

    wrap(<QuoteList {...baseProps} />)
    await screen.findByText(/page-1-quote/)

    expect(lastIntersect).not.toBeNull()
    await act(async () => {
      lastIntersect?.()
    })

    expect(
      await screen.findByText('Erreur lors du chargement.'),
    ).toBeInTheDocument()
    const retryButton = screen.getByRole('button', { name: /Réessayer/i })
    expect(retryButton).toBeInTheDocument()

    spy.mockResolvedValueOnce({
      data: [
        {
          ...firstPageQuote,
          id: 2,
          quote: 'page-2-quote',
        },
      ],
      page: 2,
      pageSize: 1,
      total: 2,
      totalPages: 2,
    })
    await userEvent.click(retryButton)
    expect(await screen.findByText(/page-2-quote/)).toBeInTheDocument()
  })
})
