type Props = {
  value: 'asc' | 'desc'
  onChange: (value: 'asc' | 'desc') => void
}

export function OrderToggle({ value, onChange }: Props) {
  const next = value === 'asc' ? 'desc' : 'asc'
  const label = value === 'asc' ? 'Croissant' : 'Décroissant'
  const arrow = value === 'asc' ? '↑' : '↓'

  return (
    <button
      type="button"
      onClick={() => onChange(next)}
      aria-label={`Ordre : ${label}. Cliquer pour inverser.`}
      title={label}
      className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
    >
      {arrow}
    </button>
  )
}
