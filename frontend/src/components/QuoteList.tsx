import { useInfiniteQuery } from '@tanstack/react-query'
import { useRef, useCallback } from 'react'
import { fetchQuotes } from '../api/quotes'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

type Props = {
  search: string
  character: string
  sort: string
  order: 'asc' | 'desc'
}

export function QuoteList({ search, character, sort, order }: Props) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['quotes', { search, character, sort, order }],
    queryFn: async ({ pageParam }) => {
      const result = await fetchQuotes({ search, character, sort, order, page: pageParam })
      return result
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  })

  const sentinelRef = useRef<HTMLDivElement>(null)
  const handleIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useIntersectionObserver(sentinelRef, {
    enabled: !!hasNextPage,
    onIntersect: handleIntersect,
  })

  if (isLoading) {
    return <p className="text-slate-500">Chargement...</p>
  }

  if (isError) {
    return <p className="text-red-600">Erreur : {error.message}</p>
  }

  const quotes = data?.pages.flatMap((p) => p.data) ?? []
  const total = data?.pages[0]?.total ?? 0

  if (quotes.length === 0) {
    return (
      <p className="text-slate-500">
        {search ? `Aucun résultat pour « ${search} ».` : 'Aucune citation.'}
      </p>
    )
  }

  return (
    <>
      <p className="text-sm text-slate-500 mb-3">
        {total} {total > 1 ? 'résultats' : 'résultat'}
      </p>
      <ul className="space-y-4">
        {quotes.map((q) => (
          <li
            key={q.id}
            className="bg-white rounded-lg shadow-sm p-4 border border-slate-200"
          >
            <p className="text-slate-800 italic">« {q.quote} »</p>
            <p className="mt-2 text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{q.character}</span>
              {' — '}
              {q.book}, épisode {q.episodeNumber} : {q.episodeTitle}
            </p>
          </li>
        ))}
      </ul>

      <div ref={sentinelRef} className="h-10" />

      {isFetchingNextPage && (
        <p className="text-center text-slate-500 mt-2">Chargement...</p>
      )}
      {!hasNextPage && quotes.length > 0 && (
        <p className="text-center text-slate-400 text-sm mt-2">
          — fin des résultats —
        </p>
      )}
    </>
  )
}
