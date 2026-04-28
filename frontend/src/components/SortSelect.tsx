import { ArrowUpDown } from 'lucide-react'

type Props = {
  value: string
  onChange: (value: string) => void
}

const options = [
  { value: 'book', label: 'Livre' },
  { value: 'episodeNumber', label: 'Épisode' },
]

export function SortSelect({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown size={16} className="text-slate-500" aria-hidden="true" />
      <span className="text-sm text-slate-600">Trier par</span>
      <div
        role="group"
        aria-label="Trier par"
        className="flex rounded-lg border border-slate-300 overflow-hidden"
      >
        {options.map((opt) => {
          const isActive = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={isActive}
              className={`px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-400 ${
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
