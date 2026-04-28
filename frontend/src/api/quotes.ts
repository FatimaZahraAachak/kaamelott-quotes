import type { QuotesResponse } from '../types/quote'

type FetchQuotesParams = {
  search: string
  character: string
  sort: string
  order: 'asc' | 'desc'
  page: number
}
export async function fetchQuotes(
  params:  FetchQuotesParams
): Promise<QuotesResponse> {
  const url = new URLSearchParams({
    pageSize: '20',
    page: String(params.page),
  })
  if (params.search) {
    url.set('q', params.search)
  }
  if (params.character) {
    url.set('character', params.character)
  }
  if (params.sort) {
    url.set('sort', params.sort)
  }
  if (params.order) {
    url.set('order', params.order)
  }

  let res: Response
  try {
    res = await fetch(`${import.meta.env.VITE_API_URL}/quotes?${url.toString()}`)
  } catch {
    throw new Error('Le serveur est injoignable.')
  }
  if (!res.ok) {
    throw new Error('Erreur serveur. Réessaie plus tard.')
  }
  return res.json()
}
