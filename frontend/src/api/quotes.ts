import type { QuotesResponse } from '../types/quote'

type FetchQuotesParams = {
  search: string
  character: string
  sort: string
  order: 'asc' | 'desc'
}
export async function fetchQuotes(
  params:  FetchQuotesParams
): Promise<QuotesResponse> {
  const url = new URLSearchParams({ pageSize: '20' })
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

  const res = await fetch(`${import.meta.env.VITE_API_URL}/quotes?${url.toString()}`)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}
