import { ArrowDown, ArrowUp } from 'lucide-react'

type Props = {
  value: 'asc' | 'desc'
  onChange: (value: 'asc' | 'desc') => void
}

export function OrderToggle({ value, onChange }: Props) {
  const next = value === 'asc' ? 'desc' : 'asc'
  const label = value === 'asc' ? 'Croissant' : 'Décroissant'
  const Icon = value === 'asc' ? ArrowUp : ArrowDown

  return (
    <button
      type="button"
      onClick={() => onChange(next)}
      aria-label={`Ordre : ${label}. Cliquer pour inverser.`}
      title={label}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
    >
      <Icon size={16} aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}
