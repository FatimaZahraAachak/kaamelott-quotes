type Props = {
  value: string
  onChange: (value: string) => void
}

export function SortSelect({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
    >
      <option value="book">Trier par livre</option>
      <option value="episodeNumber">Trier par épisode</option>
    </select>
  )
}
