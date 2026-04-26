import { useState } from 'react'
import { QuoteList } from './components/QuoteList'
import { SearchBar } from './components/SearchBar'
import { CharacterSelect } from './components/CharacterSelect'
import { useDebouncedValue } from './hooks/useDebouncedValue'

export default function App() {
  const [search, setSearch] = useState('')
  const [character, setCharacter] = useState('')
  const debouncedSearch = useDebouncedValue(search, 400)

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Citations Kaamelott
        </h1>
        <div className="mb-3">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="mb-6">
          <CharacterSelect value={character} onChange={setCharacter} />
        </div>
        <QuoteList search={debouncedSearch} character={character} />
      </div>
    </main>
  )
}
