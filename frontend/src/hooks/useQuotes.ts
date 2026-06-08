import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchQuotes } from '../api/quotes'

type Params = {
  search: string
  character: string
  sort: string
  order: 'asc' | 'desc'
}

export function useQuotes(params: Params) {
  return useInfiniteQuery({
    queryKey: ['quotes', params],
    queryFn: ({ pageParam }) => fetchQuotes({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
  })
}
