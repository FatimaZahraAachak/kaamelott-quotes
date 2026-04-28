import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { CharacterSelect } from './CharacterSelect'
import * as api from '../api/characters'

function wrap(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  )
}

beforeEach(() => vi.restoreAllMocks())

describe('CharacterSelect', () => {
  it('shows an error message when fetching characters fails', async () => {
    vi.spyOn(api, 'fetchCharacters').mockRejectedValue(new Error('boom'))
    wrap(<CharacterSelect value="" onChange={() => {}} />)

    expect(
      await screen.findByText('Impossible de charger les personnages.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeDisabled()
  })
})
