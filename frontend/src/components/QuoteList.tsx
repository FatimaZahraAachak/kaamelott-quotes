import { useRef, useCallback } from 'react'
import { useQuotes } from '../hooks/useQuotes'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { QuoteCard } from './QuoteCard'

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
    isLoadingError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useQuotes({ search, character, sort, order })

  const sentinelRef = useRef<HTMLDivElement>(null)
  const onIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useIntersectionObserver(sentinelRef, {
    enabled: !!hasNextPage && !isFetchNextPageError,
    onIntersect,
  })

  if (isLoading) return <p className="text-slate-500">Chargement...</p>

  if (isLoadingError) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-2">{error?.message}</p>
        <button onClick={() => refetch()} className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">
          Réessayer
        </button>
      </div>
    )
  }

  const allQuotes = data?.pages.flatMap((p) => p.data) ?? []
  const total = data?.pages[0]?.total ?? 0

  if (allQuotes.length === 0) {
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
        {allQuotes.map((q) => <QuoteCard key={q.id} quote={q} />)}
      </ul>

      <div ref={sentinelRef} className="h-10" />

      {isFetchingNextPage && (
        <p className="text-center text-slate-500 mt-2">Chargement...</p>
      )}
      {isFetchNextPageError && (
        <div className="text-center mt-2">
          <p className="text-red-600 text-sm">Erreur lors du chargement.</p>
          <button onClick={() => fetchNextPage()} className="mt-1 px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">
            Réessayer
          </button>
        </div>
      )}
      {!hasNextPage && allQuotes.length > 0 && (
        <p className="text-center text-slate-400 text-sm mt-2">— fin des résultats —</p>
      )}
    </>
  )
}
