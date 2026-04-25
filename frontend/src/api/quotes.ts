import type { QuotesResponse } from '../types/quote'

export async function fetchQuotes(): Promise<QuotesResponse> {
  const res = await fetch('/quotes?pageSize=20')
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}
