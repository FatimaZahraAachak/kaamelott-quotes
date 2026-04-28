import { useQuery } from '@tanstack/react-query'
import { ChevronDown, User } from 'lucide-react'
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
    <div>
      <div className="relative">
        <User
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          size={18}
          aria-hidden="true"
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading || isError}
          className="w-full appearance-none pl-10 pr-10 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50"
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
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          size={18}
          aria-hidden="true"
        />
      </div>
      {isError && (
        <p className="text-red-600 text-sm mt-1">
          Impossible de charger les personnages.
        </p>
      )}
    </div>
  )
}
