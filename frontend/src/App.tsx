import { QuoteList } from './components/QuoteList'

export default function App() {
  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Citations Kaamelott
        </h1>
        <QuoteList />
      </div>
    </main>
  )
}
