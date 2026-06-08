type CharactersResponse = { data: string[] }

export async function fetchCharacters(): Promise<CharactersResponse> {
  let res: Response
  try {
    const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
    res = await fetch(`${base}/characters`)
  } catch {
    throw new Error('Le serveur est injoignable.')
  }
  if (!res.ok) {
    throw new Error('Erreur serveur. Réessaie plus tard.')
  }
  return res.json()
}
