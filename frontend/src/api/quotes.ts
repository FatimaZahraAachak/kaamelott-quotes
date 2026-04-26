import type { QuotesResponse } from '../types/quote'

type FetchQuotesParams = {
  search: string
}
export async function fetchQuotes(
  params:  FetchQuotesParams
): Promise<QuotesResponse> {
  const url = new URLSearchParams({ pageSize: '20' })
  if (params.search) {
    url.set('q', params.search)
  }

  const res = await fetch(`/quotes?${url.toString()}`)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}
