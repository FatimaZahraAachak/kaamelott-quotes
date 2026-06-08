import type { Quote } from '../types/quote'

type Props = { quote: Quote }

export function QuoteCard({ quote }: Props) {
  return (
    <li className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
      <p className="text-slate-800 italic">« {quote.quote} »</p>
      <p className="mt-2 text-sm text-slate-500">
        <span className="font-semibold text-slate-700">{quote.character}</span>
        {' — '}
        {quote.book}, épisode {quote.episodeNumber} : {quote.episodeTitle}
      </p>
    </li>
  )
}
