import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { QuoteList } from './QuoteList'
import * as api from '../api/quotes'

vi.mock('../hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => {},
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

beforeEach(() => vi.restoreAllMocks())

describe('QuoteList', () => {
  it('renders the loading message during initial fetch', () => {
    vi.spyOn(api, 'fetchQuotes').mockImplementation(
      () => new Promise(() => {}),
    )
    wrap(<QuoteList {...baseProps} />)
    expect(screen.getByText('Chargement...')).toBeInTheDocument()
  })

  it('renders the error message when fetchQuotes fails', async () => {
    vi.spyOn(api, 'fetchQuotes').mockRejectedValue(new Error('boom'))
    wrap(<QuoteList {...baseProps} />)
    expect(await screen.findByText(/Erreur : boom/)).toBeInTheDocument()
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
})
