import { useState } from 'react'
import { QuoteList } from './components/QuoteList'
import { SearchBar } from './components/SearchBar'

export default function App() {
  const [search, setSearch] = useState('')

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Citations Kaamelott
        </h1>
        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <QuoteList search={search} />
      </div>
    </main>
  )
}
