import { useState } from 'react'
import { QuoteList } from './components/QuoteList'
import { SearchBar } from './components/SearchBar'
import { CharacterSelect } from './components/CharacterSelect'
import { SortSelect } from './components/SortSelect'
import { OrderToggle } from './components/OrderToggle'
import { Toolbar } from './components/Toolbar'
import { useDebouncedValue } from './hooks/useDebouncedValue'

export default function App() {
  const [search, setSearch] = useState('')
  const [character, setCharacter] = useState('')
  const [sort, setSort] = useState('book')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const debouncedSearch = useDebouncedValue(search, 400)

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Citations Kaamelott
        </h1>
        <Toolbar>
          <SearchBar value={search} onChange={setSearch} />
          <CharacterSelect value={character} onChange={setCharacter} />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SortSelect value={sort} onChange={setSort} />
            <OrderToggle value={order} onChange={setOrder} />
          </div>
        </Toolbar>
        <QuoteList
          search={debouncedSearch}
          character={character}
          sort={sort}
          order={order}
        />
      </div>
    </main>
  )
}
