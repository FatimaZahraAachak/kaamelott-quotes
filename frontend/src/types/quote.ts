export type Quote = {
  id: number
  book: string
  episodeNumber: number
  episodeTitle: string
  actor: string
  character: string
  author: string
  quote: string
  quoteNormalized: string
}

export type QuotesResponse = {
  data: Quote[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}
