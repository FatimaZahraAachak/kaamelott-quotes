import { useQuery } from '@tanstack/react-query'
import { fetchQuotes } from '../api/quotes'

type Props = {
  search: string
}

export function QuoteList({ search }: Props) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['quotes', { search }],
    queryFn: () => fetchQuotes({ search }),
  })

  if (isLoading) {
    return <p className="text-slate-500">Chargement...</p>
  }

  if (isError) {
    return <p className="text-red-600">Erreur : {error.message}</p>
  }

  if (!data || data.data.length === 0) {
    return (
      <p className="text-slate-500">
        {search ? `Aucun résultat pour « ${search} ».` : 'Aucune citation.'}
      </p>
    )
  }

  return (
    <>
      <p className="text-sm text-slate-500 mb-3">
        {data.total} {data.total > 1 ? 'résultats' : 'résultat'}
      </p>
      <ul className="space-y-4">
        {data.data.map((q) => (
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
    </>
  )
}
