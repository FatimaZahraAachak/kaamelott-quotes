import { useQuery } from '@tanstack/react-query'
import { fetchCharacters } from '../api/characters'

type Props = {
  value: string
  onChange: (value: string) => void
}

export function CharacterSelect({ value, onChange }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['characters'],
    queryFn: fetchCharacters,
  })

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={isLoading || isError}
      className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50"
    >
      <option value="">
        {isLoading ? 'Chargement...' : 'Tous les personnages'}
      </option>
      {data?.data.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  )
}
